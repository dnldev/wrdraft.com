import { useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { calculateRecommendations, Recommendation } from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { createTierMap } from "@/lib/utils";

interface Selections {
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

/**
 * A "headless" hook that manages the entire state and logic for the Matchup Calculator.
 * It handles user selections, triggers calculations, and derives memoized data, returning
 * everything the presentation components need to render the UI.
 * @param {UseMatchupCalculatorProps} props - The raw data fetched from Redis, required for calculations and display.
 * @returns {object} An object containing the calculator's state, derived data, and event handlers.
 */
export function useMatchupCalculator({
  adcs,
  supports,
  allChampions,
  synergyMatrix,
  counterMatrix,
  firstPicks,
  tierList,
  categories,
}: UseMatchupCalculatorProps) {
  const [roleToCalculate, setRoleToCalculate] = useState<"adc" | "support">(
    "adc"
  );
  const [selections, setSelections] = useState<Selections>({
    alliedAdc: null,
    alliedSupport: null,
    enemyAdc: null,
    enemySupport: null,
  });

  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const championMap = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const champ of allChampions) {
      map.set(champ.name, champ);
    }
    return map;
  }, [allChampions]);

  const championTierMap = useMemo(() => createTierMap(tierList), [tierList]);

  const handleSelectionChange = (
    role: keyof typeof selections,
    name: string | null
  ) => {
    setSelections((prev) => ({ ...prev, [role]: name }));
    setResults(null);
  };

  const handleRoleChange = (role: "adc" | "support") => {
    setRoleToCalculate(role);
    setResults(null);
    setSelections((prev) => ({
      ...prev,
      ...(role === "adc" && { alliedAdc: null }),
      ...(role === "support" && { alliedSupport: null }),
    }));
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setResults(null);

    const championPool = roleToCalculate === "adc" ? adcs : supports;
    const recommendations = calculateRecommendations({
      roleToCalculate,
      championPool,
      selections,
      synergyMatrix,
      counterMatrix,
      categories,
    });

    setTimeout(() => {
      setResults(recommendations);
      setIsCalculating(false);
    }, 300);
  };

  const isSelectionEmpty = Object.values(selections).every((s) => s === null);
  const currentFirstPicks =
    roleToCalculate === "adc" ? firstPicks.adcs : firstPicks.supports;

  return {
    roleToCalculate,
    selections,
    results,
    isCalculating,
    championMap,
    championTierMap,
    handleSelectionChange,
    handleRoleChange,
    handleCalculate,
    isSelectionEmpty,
    currentFirstPicks,
  };
}
