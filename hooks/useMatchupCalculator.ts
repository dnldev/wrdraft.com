import { useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPick, FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import {
  calculatePairRecommendations,
  calculateRecommendations,
  PairRecommendation,
  Recommendation,
} from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { createTierMap } from "@/lib/utils";

import { useDebounce } from "./useDebounce";

export interface Selections {
  alliedAdc: string | null;
  alliedSupport: string | null;
  enemyAdc: string | null;
  enemySupport: string | null;
}

interface UseMatchupCalculatorProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  firstPicks: FirstPickData;
  tierList: TierListData;
  categories: RoleCategories[];
}

type RoleToCalculate = "adc" | "support" | "both";

interface CalculationContext {
  selections: Selections;
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  categories: RoleCategories[];
  adcs: Champion[];
  supports: Champion[];
}

/**
 * Defines the contract for a calculation strategy, encapsulating all mode-specific logic.
 */
interface CalculationStrategy {
  calculate: (
    context: CalculationContext
  ) => (Recommendation | PairRecommendation)[];
  getFirstPicks: (firstPicks: FirstPickData) => FirstPick[];
  getSelectionsToClear: () => Partial<Selections>;
  getNextRoleOnSelection?: (
    selectionRole: keyof Selections
  ) => RoleToCalculate | null;
}

/**
 * A manifest of calculation strategies, implementing the Strategy Pattern.
 */
const calculationStrategies: Record<RoleToCalculate, CalculationStrategy> = {
  adc: {
    calculate: (context) =>
      calculateRecommendations({
        ...context,
        roleToCalculate: "adc",
        championPool: context.adcs,
      }),
    getFirstPicks: (firstPicks) => firstPicks.adcs,
    getSelectionsToClear: () => ({ alliedAdc: null }),
  },
  support: {
    calculate: (context) =>
      calculateRecommendations({
        ...context,
        roleToCalculate: "support",
        championPool: context.supports,
      }),
    getFirstPicks: (firstPicks) => firstPicks.supports,
    getSelectionsToClear: () => ({ alliedSupport: null }),
  },
  both: {
    calculate: (context) => calculatePairRecommendations(context),
    getFirstPicks: (firstPicks) => firstPicks.adcs,
    getSelectionsToClear: () => ({ alliedAdc: null, alliedSupport: null }),
    getNextRoleOnSelection: (selectionRole) => {
      if (selectionRole === "alliedAdc") return "support";
      if (selectionRole === "alliedSupport") return "adc";
      return null;
    },
  },
};

/**
 * Manages the state and logic for the Matchup Calculator using the Strategy Pattern.
 */
export function useMatchupCalculator(props: UseMatchupCalculatorProps) {
  const {
    adcs,
    supports,
    allChampions,
    firstPicks,
    tierList,
    categories,
    synergyMatrix,
    counterMatrix,
  } = props;

  const [roleToCalculate, setRoleToCalculate] =
    useState<RoleToCalculate>("adc");
  const [selections, setSelections] = useState<Selections>({
    alliedAdc: null,
    alliedSupport: null,
    enemyAdc: null,
    enemySupport: null,
  });

  const debouncedSelections = useDebounce(selections, 1500);
  const currentStrategy = calculationStrategies[roleToCalculate];
  const isSelectionEmpty = Object.values(selections).every((s) => s === null);

  const championMap = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const champ of allChampions) map.set(champ.name, champ);
    return map;
  }, [allChampions]);

  const championTierMap = useMemo(() => createTierMap(tierList), [tierList]);

  const handleSelectionChange = (
    role: keyof Selections,
    name: string | null
  ) => {
    setSelections((prev) => ({ ...prev, [role]: name }));
    if (name) {
      const nextRole = currentStrategy.getNextRoleOnSelection?.(role);
      if (nextRole) setRoleToCalculate(nextRole);
    }
  };

  const handleRoleChange = (role: RoleToCalculate) => {
    setRoleToCalculate(role);
    const selectionsToClear =
      calculationStrategies[role].getSelectionsToClear();
    setSelections((prev) => ({ ...prev, ...selectionsToClear }));
  };

  const results = useMemo(() => {
    if (isSelectionEmpty) return null;
    const context = {
      adcs,
      supports,
      selections: debouncedSelections,
      synergyMatrix,
      counterMatrix,
      categories,
    };
    return currentStrategy.calculate(context);
  }, [
    debouncedSelections,
    isSelectionEmpty,
    adcs,
    supports,
    synergyMatrix,
    counterMatrix,
    categories,
    currentStrategy,
  ]);

  const isCalculating = useMemo(() => {
    return (
      !isSelectionEmpty &&
      JSON.stringify(selections) !== JSON.stringify(debouncedSelections)
    );
  }, [selections, debouncedSelections, isSelectionEmpty]);

  return {
    roleToCalculate,
    selections,
    results,
    isCalculating,
    championMap,
    championTierMap,
    handleSelectionChange,
    handleRoleChange,
    isSelectionEmpty,
    currentFirstPicks: currentStrategy.getFirstPicks(firstPicks),
  };
}
