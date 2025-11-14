"use client";

import { isEqual } from "lodash-es";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import {
  BreakdownItem,
  calculatePairRecommendations,
  createDraftSummary,
  PairRecommendation,
} from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { logger } from "@/lib/development-logger";
import { Archetype, createTierMap } from "@/lib/utils";
import { SavedDraft, Selections } from "@/types/draft";

export interface DraftSummary {
  readonly overallScore: number;
  readonly winChance: number;
  readonly breakdown: BreakdownItem[];
  readonly selections: Selections;
  readonly archetypes: {
    readonly your: Archetype;
    readonly enemy: Archetype;
  };
}

interface UseMatchupCalculatorProps {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly allChampions: Champion[];
  readonly synergyMatrix: SynergyMatrix;
  readonly counterMatrix: CounterMatrix;
  readonly firstPicks: FirstPickData;
  readonly tierList: TierListData;
  readonly categories: RoleCategories[];
  readonly bannedChampions: Set<string>;
  readonly draftHistory: readonly SavedDraft[];
}

/**
 * Manages the state and logic for calculating champion recommendations.
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
    draftHistory,
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

  useEffect(() => {
    logger.debug("useMatchupCalculator", "Selections changed", selections);
  }, [selections]);

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
    logger.debug(
      "useMatchupCalculator",
      "Recalculating recommendations...",
      deferredSelections
    );
    if (Object.values(deferredSelections).every((s) => s === null)) return null;
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
    logger.debug(
      "useMatchupCalculator",
      "Recalculating draft summary...",
      deferredSelections
    );
    return createDraftSummary({
      selections: deferredSelections,
      championMap,
      synergyMatrix,
      counterMatrix,
      categories,
      draftHistory,
    });
  }, [
    deferredSelections,
    championMap,
    synergyMatrix,
    counterMatrix,
    categories,
    draftHistory,
  ]);

  const isCalculating = useMemo(
    () => !isEqual(selections, deferredSelections),
    [selections, deferredSelections]
  );

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
