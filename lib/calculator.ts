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
 * Calculates the synergy score for a single champion.
 * @returns An object with the score and reason, or null if no synergy exists.
 */
function getSynergyScore(
  champion: Champion,
  roleToCalculate: "adc" | "support",
  selections: Selections,
  synergyMatrix: SynergyMatrix
): { value: number; reason: string } | null {
  if (roleToCalculate === "adc" && selections.alliedSupport) {
    const score = synergyMatrix[champion.name]?.[selections.alliedSupport] ?? 0;
    return score === 0
      ? null
      : { value: score, reason: `Synergy with ${selections.alliedSupport}` };
  }
  if (roleToCalculate === "support" && selections.alliedAdc) {
    const score = synergyMatrix[selections.alliedAdc]?.[champion.name] ?? 0;
    return score === 0
      ? null
      : { value: score, reason: `Synergy with ${selections.alliedAdc}` };
  }
  return null;
}

/**
 * Calculates the counter scores against enemy champions.
 * @returns An array of score objects with their reasons.
 */
function getCounterScores(
  champion: Champion,
  selections: Selections,
  counterMatrix: CounterMatrix
): { value: number; reason: string }[] {
  const scores = [];
  if (selections.enemyAdc) {
    const score = counterMatrix[champion.name]?.[selections.enemyAdc] ?? 0;
    if (score !== 0) {
      scores.push({
        value: score,
        reason: `Matchup vs ${selections.enemyAdc}`,
      });
    }
  }
  if (selections.enemySupport) {
    const score = counterMatrix[champion.name]?.[selections.enemySupport] ?? 0;
    if (score !== 0) {
      scores.push({
        value: score,
        reason: `Matchup vs ${selections.enemySupport}`,
      });
    }
  }
  return scores;
}

/**
 * Calculates matchup recommendations based on weighted scores.
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
  const selectedChampionNames = new Set(
    Object.values(selections).filter(Boolean)
  );

  const availableChampions = championPool.filter(
    (champ) => !selectedChampionNames.has(champ.name)
  );

  const results = availableChampions.map((champion) => {
    const breakdown: { value: number; reason: string }[] = [];
    let score = 0;

    const synergy = getSynergyScore(
      champion,
      roleToCalculate,
      selections,
      synergyMatrix
    );
    if (synergy) {
      breakdown.push(synergy);
    }

    const counters = getCounterScores(champion, selections, counterMatrix);
    breakdown.push(...counters);

    for (const item of breakdown) {
      score += item.value;
    }

    return { champion, score, breakdown };
  });

  const filteredResults = results.filter(
    (result) => result.breakdown.length > 0
  );

  return filteredResults.toSorted((a, b) => {
    // Primary sort: by score, descending
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    // Secondary sort: comfort picks first
    const aIsComfort = a.champion.comfort !== null;
    const bIsComfort = b.champion.comfort !== null;

    if (aIsComfort && !bIsComfort) {
      return -1; // a comes first
    }
    if (!aIsComfort && bIsComfort) {
      return 1; // b comes first
    }
    return 0; // maintain order
  });
}
