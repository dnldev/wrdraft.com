"use client";

import React from "react";

import { Champion } from "@/data/championData";
import { FirstPick } from "@/data/firstPickData";
import { PairRecommendation } from "@/lib/calculator";

import { FirstPicksDisplay } from "./FirstPicksDisplay";
import { RecommendationResults } from "./RecommendationResults";

interface CalculatorResultsContentProps {
  readonly bansLocked: boolean;
  readonly isSelectionEmpty: boolean;
  readonly combinedFirstPicks: FirstPick[];
  readonly championMap: Map<string, Champion>;
  readonly championTierMap: Map<string, string>;
  readonly results: PairRecommendation[] | null;
}

/**
 * A component that handles the conditional rendering of the calculator's main content area.
 * It decides whether to show the safe first picks display or the recommendation results based on the draft state.
 */
export const CalculatorResultsContent: React.FC<
  CalculatorResultsContentProps
> = ({
  bansLocked,
  isSelectionEmpty,
  combinedFirstPicks,
  championMap,
  championTierMap,
  results,
}) => {
  if (!bansLocked) {
    return null;
  }

  return isSelectionEmpty ? (
    <FirstPicksDisplay
      firstPicks={combinedFirstPicks}
      championMap={championMap}
      tierMap={championTierMap}
    />
  ) : (
    <RecommendationResults results={results || []} />
  );
};
