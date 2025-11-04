// FILE: lib/calculator.ts
import { Champion } from "@/data/championData";

import { CounterMatrix, SynergyMatrix } from "./data-fetching";

export interface Recommendation {
  champion: Champion;
  score: number;
  breakdown: { reason: string; value: number }[];
}

interface Selections {
  alliedAdc?: string | null;
  alliedSupport?: string | null;
  enemyAdc?: string | null;
  enemySupport?: string | null;
}

/**
 * Calculates matchup recommendations based on weighted scores.
 * @param roleToCalculate The role ('adc' or 'support') to generate recommendations for.
 * @param championPool The list of champions to score.
 * @param selections The selected allied and enemy champions.
 * @param synergyMatrix The matrix of synergy scores.
 * @param counterMatrix The matrix of counter scores.
 * @returns A sorted array of recommendations.
 */
export function calculateRecommendations({
  roleToCalculate,
  championPool,
  selections,
  synergyMatrix,
  counterMatrix,
}: {
  roleToCalculate: "adc" | "support";
  championPool: Champion[];
  selections: Selections;
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
}): Recommendation[] {
  const results: Recommendation[] = [];

  for (const champion of championPool) {
    let score = 0;
    const breakdown: { reason: string; value: number }[] = [];

    // 1. Synergy Score Calculation
    if (roleToCalculate === "adc" && selections.alliedSupport) {
      const synergyScore =
        synergyMatrix[champion.name]?.[selections.alliedSupport] ?? 0;
      if (synergyScore !== 0) {
        score += synergyScore;
        breakdown.push({
          reason: `Synergy with ${selections.alliedSupport}`,
          value: synergyScore,
        });
      }
    } else if (roleToCalculate === "support" && selections.alliedAdc) {
      const synergyScore =
        synergyMatrix[selections.alliedAdc]?.[champion.name] ?? 0;
      if (synergyScore !== 0) {
        score += synergyScore;
        breakdown.push({
          reason: `Synergy with ${selections.alliedAdc}`,
          value: synergyScore,
        });
      }
    }

    // 2. Counter Score Calculation vs. Enemy ADC
    if (selections.enemyAdc) {
      const counterScore =
        counterMatrix[champion.name]?.[selections.enemyAdc] ?? 0;
      if (counterScore !== 0) {
        score += counterScore;
        breakdown.push({
          reason: `Matchup vs ${selections.enemyAdc}`,
          value: counterScore,
        });
      }
    }

    // 3. Counter Score Calculation vs. Enemy Support
    if (selections.enemySupport) {
      const counterScore =
        counterMatrix[champion.name]?.[selections.enemySupport] ?? 0;
      if (counterScore !== 0) {
        score += counterScore;
        breakdown.push({
          reason: `Matchup vs ${selections.enemySupport}`,
          value: counterScore,
        });
      }
    }

    results.push({ champion, score, breakdown });
  }

  // Sort results from highest score to lowest
  results.sort((a, b) => b.score - a.score);

  return results;
}
