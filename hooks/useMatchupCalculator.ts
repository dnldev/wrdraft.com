import _ from "lodash";
import { useDeferredValue, useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import {
  BreakdownItem,
  calculatePairRecommendations,
  PairRecommendation,
} from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { createTierMap } from "@/lib/utils";

export interface Selections {
  alliedAdc: string | null;
  alliedSupport: string | null;
  enemyAdc: string | null;
  enemySupport: string | null;
}

export interface DraftSummary {
  overallScore: number;
  winChance: number;
  breakdown: BreakdownItem[];
  selections: Selections;
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
  bannedChampions: Set<string>;
}

/**
 * Manages the state and logic for calculating champion recommendations.
 * It receives the current selections and the set of banned champions,
 * and returns calculated results and other derived state.
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
    bannedChampions,
  } = props;

  const [selections, setSelections] = useState<Selections>({
    alliedAdc: null,
    alliedSupport: null,
    enemyAdc: null,
    enemySupport: null,
  });

  const deferredSelections = useDeferredValue(selections);
  const deferredBans = useDeferredValue(bannedChampions);
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
  };

  const unavailableChampions = useMemo(() => {
    const picked = new Set(
      Object.values(deferredSelections).filter(Boolean) as string[]
    );
    return new Set([...picked, ...deferredBans]);
  }, [deferredSelections, deferredBans]);

  const availableAdcs = useMemo(
    () => adcs.filter((c) => !unavailableChampions.has(c.name)),
    [adcs, unavailableChampions]
  );
  const availableSupports = useMemo(
    () => supports.filter((c) => !unavailableChampions.has(c.name)),
    [supports, unavailableChampions]
  );

  const results: PairRecommendation[] | null = useMemo(() => {
    if (Object.values(deferredSelections).every((s) => s === null)) {
      return null;
    }

    return calculatePairRecommendations({
      adcs: availableAdcs,
      supports: availableSupports,
      selections: deferredSelections,
      synergyMatrix,
      counterMatrix,
      categories,
      championMap,
    });
  }, [
    deferredSelections,
    availableAdcs,
    availableSupports,
    synergyMatrix,
    counterMatrix,
    categories,
    championMap,
  ]);

  const draftSummary: DraftSummary | null = useMemo(() => {
    const { alliedAdc, alliedSupport, enemyAdc, enemySupport } =
      deferredSelections;
    if (!alliedAdc || !alliedSupport || !enemyAdc || !enemySupport) {
      return null;
    }

    const alliedPair = calculatePairRecommendations({
      adcs: [championMap.get(alliedAdc)!],
      supports: [championMap.get(alliedSupport)!],
      selections: deferredSelections,
      synergyMatrix,
      counterMatrix,
      categories,
      championMap,
    });

    if (!alliedPair || alliedPair.length === 0) return null;

    const summary = alliedPair[0];
    const overallScore = summary.score;
    const winChance = Math.max(10, Math.min(90, 50 + overallScore * 3));

    return {
      overallScore,
      winChance,
      breakdown: summary.breakdown,
      selections: deferredSelections,
    };
  }, [
    deferredSelections,
    synergyMatrix,
    counterMatrix,
    categories,
    championMap,
  ]);

  const isCalculating = useMemo(() => {
    return !_.isEqual(selections, deferredSelections);
  }, [selections, deferredSelections]);

  const combinedFirstPicks = useMemo(() => {
    const ratingOrder: Record<string, number> = {
      "S-Tier": 0,
      "A-Tier": 1,
      "B-Tier": 2,
      "C-Tier": 3,
    };
    const unavailable = new Set([
      ...bannedChampions,
      ...Object.values(selections).filter(Boolean),
    ]);

    const safeAdcs = firstPicks.adcs
      .filter((p) => !unavailable.has(p.name))
      .slice(0, 4);
    const safeSupports = firstPicks.supports
      .filter((p) => !unavailable.has(p.name))
      .slice(0, 4);

    return [...safeAdcs, ...safeSupports].toSorted(
      (a, b) => ratingOrder[a.rating] - ratingOrder[b.rating]
    );
  }, [firstPicks, bannedChampions, selections]);

  return {
    selections,
    results,
    isCalculating,
    championMap,
    championTierMap,
    handleSelectionChange,
    isSelectionEmpty,
    combinedFirstPicks,
    draftSummary,
  };
}
