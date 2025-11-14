import { flatMap } from "lodash-es";

import { RoleCategories } from "@/data/categoryData";
import { Champion, ComfortTier } from "@/data/championData";
import { DraftSummary } from "@/hooks/useMatchupCalculator";
import { SavedDraft, Selections } from "@/types/draft";

import { CounterMatrix, SynergyMatrix } from "./data-fetching";
import { calculateMatchupPerformance } from "./stats";
import { Archetype, getLaneArchetype } from "./utils";

export interface PairRecommendation {
  readonly adc: Champion;
  readonly support: Champion;
  readonly score: number;
  readonly breakdown: BreakdownItem[];
}

export type BreakdownItem = { readonly reason: string; readonly value: number };

const comfortScores: Record<NonNullable<ComfortTier>, number> = {
  "S+": 3,
  S: 2,
  A: 1,
  B: 0,
};

const WEIGHTS = {
  COMFORT: 1,
  ARCHETYPE: 1.2,
  SYNERGY: 1,
  COUNTER: 1.5,
};

/**
 * Defines the bounds for the win chance calculation.
 * The range is clamped between 20% and 80% to avoid presenting unrealistic
 * absolutes. In a game of skill, no matchup is ever truly unwinnable or
 * guaranteed. The 48% average provides a slightly pessimistic baseline,
 * acknowledging that uncoordinated play is more common than optimal play.
 */
const WIN_CHANCE_CONFIG = {
  MIN: 20,
  AVG: 48,
  MAX: 80,
};

// Constants for historical performance calculation.
const HISTORICAL = {
  BASELINE_WIN_RATE: 50, // The win rate considered neutral.
  WIN_RATE_SCALE: 25, // Divisor to scale the win rate deviation.
  CONFIDENCE_MULTIPLIER: 2, // Multiplier for the confidence factor.
};

function getComfortScore(champion: Champion): BreakdownItem | null {
  if (!champion.comfort) return null;
  const score = comfortScores[champion.comfort];
  return score > 0
    ? { value: score, reason: `Comfort Pick (${champion.comfort})` }
    : null;
}

function getArchetypeScore(
  allied: Archetype,
  enemy: Archetype
): BreakdownItem | null {
  const archetypeScoreValue = 2;
  if (allied === "Unknown" || enemy === "Unknown") return null;
  if (allied === enemy)
    return { value: 0, reason: `Archetype Mirror (${allied})` };

  const advantages: Partial<Record<Archetype, Archetype>> = {
    Poke: "Engage",
    Engage: "Sustain",
    Sustain: "Poke",
  };
  if (advantages[allied] === enemy)
    return {
      value: archetypeScoreValue,
      reason: `Archetype Advantage (${allied} > ${enemy})`,
    };
  return {
    value: -archetypeScoreValue,
    reason: `Archetype Disadvantage (${allied} < ${enemy})`,
  };
}

function getSynergyScore(
  adc: string | null,
  support: string | null,
  synergyMatrix: SynergyMatrix,
  isEnemy: boolean = false
): BreakdownItem | null {
  if (!adc || !support) return null;
  const score = synergyMatrix[adc]?.[support] ?? 0;
  if (score === 0) return null;
  const reason = isEnemy ? "Enemy Team Synergy" : "Your Team Synergy";
  return { value: isEnemy ? -score : score, reason };
}

function getCounterScore(
  championName: string,
  opponentName: string | null,
  counterMatrix: CounterMatrix
): BreakdownItem | null {
  if (!opponentName) return null;
  const score = counterMatrix[championName]?.[opponentName] ?? 0;
  if (score === 0) return null;
  return { value: score, reason: `${championName} vs ${opponentName}` };
}

function analyzePair(context: {
  readonly adc: Champion;
  readonly support: Champion;
  readonly selections: Selections;
  readonly synergyMatrix: SynergyMatrix;
  readonly counterMatrix: CounterMatrix;
  readonly categories: readonly RoleCategories[];
  readonly enemyLaneArchetype: Archetype;
}): {
  adc: Champion;
  support: Champion;
  weightedScore: number;
  breakdown: BreakdownItem[];
} | null {
  const {
    adc,
    support,
    selections,
    synergyMatrix,
    counterMatrix,
    categories,
    enemyLaneArchetype,
  } = context;
  const prospectiveArchetype = getLaneArchetype(
    adc.name,
    support.name,
    categories
  );
  const breakdown = [
    getComfortScore(adc),
    getComfortScore(support),
    getArchetypeScore(prospectiveArchetype, enemyLaneArchetype),
    getSynergyScore(adc.name, support.name, synergyMatrix),
    getCounterScore(adc.name, selections.enemyAdc, counterMatrix),
    getCounterScore(adc.name, selections.enemySupport, counterMatrix),
    getCounterScore(support.name, selections.enemyAdc, counterMatrix),
    getCounterScore(support.name, selections.enemySupport, counterMatrix),
  ].filter((item): item is BreakdownItem => item !== null);

  if (breakdown.length === 0) return null;

  let weightedScore = 0;
  for (const item of breakdown) {
    let weight = 1;
    if (item.reason.includes("Comfort")) {
      weight = WEIGHTS.COMFORT;
    } else if (item.reason.includes("Archetype")) {
      weight = WEIGHTS.ARCHETYPE;
    } else if (item.reason.includes("Synergy")) {
      weight = WEIGHTS.SYNERGY;
    } else if (item.reason.includes("vs")) {
      weight = WEIGHTS.COUNTER;
    }
    weightedScore += item.value * weight;
  }

  return {
    adc,
    support,
    weightedScore: Math.round(weightedScore),
    breakdown,
  };
}

function getAllPairs(
  adcs: readonly Champion[],
  supports: readonly Champion[]
): { adc: Champion; support: Champion }[] {
  return flatMap(adcs, (adc) => supports.map((support) => ({ adc, support })));
}

function getChampionsToIterate(
  selectedChampion: string | null,
  championPool: readonly Champion[],
  championMap: Map<string, Champion>
): readonly Champion[] {
  if (selectedChampion) {
    const champion = championMap.get(selectedChampion);
    return champion ? [champion] : [];
  }
  return championPool;
}

function getComfortScoreForPair(pair: PairRecommendation): number {
  const adcComfort = pair.adc.comfort ? 1 : 0;
  const supportComfort = pair.support.comfort ? 1 : 0;
  return adcComfort + supportComfort;
}

function sortRecommendations(
  a: PairRecommendation,
  b: PairRecommendation
): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }
  const aComfort = getComfortScoreForPair(a);
  const bComfort = getComfortScoreForPair(b);
  return bComfort - aComfort;
}

export function calculatePairRecommendations(context: {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly selections: Selections;
  readonly synergyMatrix: SynergyMatrix;
  readonly counterMatrix: CounterMatrix;
  readonly categories: RoleCategories[];
  readonly championMap: Map<string, Champion>;
}): PairRecommendation[] {
  const { adcs, supports, selections, championMap, ...restOfContext } = context;

  const adcsToIterate = getChampionsToIterate(
    selections.alliedAdc,
    adcs,
    championMap
  );
  const supportsToIterate = getChampionsToIterate(
    selections.alliedSupport,
    supports,
    championMap
  );

  const allPossiblePairs = getAllPairs(adcsToIterate, supportsToIterate);

  const enemyLaneArchetype = getLaneArchetype(
    selections.enemyAdc,
    selections.enemySupport,
    restOfContext.categories
  );
  const analysisContext = { selections, enemyLaneArchetype, ...restOfContext };

  const recommendations = flatMap(allPossiblePairs, ({ adc, support }) => {
    const analysis = analyzePair({ adc, support, ...analysisContext });

    if (!analysis || analysis.weightedScore <= 0) {
      return [];
    }

    return [
      {
        adc,
        support,
        score: analysis.weightedScore,
        breakdown: analysis.breakdown,
      },
    ];
  });

  return recommendations.toSorted(sortRecommendations);
}

function getHistoricalAdjustmentScore(
  selections: Selections,
  draftHistory: readonly SavedDraft[]
): BreakdownItem | null {
  const performance = calculateMatchupPerformance(selections, draftHistory);
  if (!performance || performance.gamesPlayed < 2) {
    return null;
  }

  const deviation =
    (performance.winRate - HISTORICAL.BASELINE_WIN_RATE) /
    HISTORICAL.WIN_RATE_SCALE;
  const confidence = Math.log2(performance.gamesPlayed);
  const adjustment = Math.round(
    deviation * HISTORICAL.CONFIDENCE_MULTIPLIER * confidence
  );

  if (adjustment === 0) return null;

  return {
    value: adjustment,
    reason: `Historical Performance (${performance.winRate}% WR in ${performance.gamesPlayed}g)`,
  };
}

/**
 * Calculates the final draft summary, including a reality-adjusted score and win chance.
 * @param {object} context - The context required for the calculation.
 * @returns {DraftSummary | null} The complete draft summary or null if selections are incomplete.
 */
export function createDraftSummary({
  selections,
  championMap,
  synergyMatrix,
  counterMatrix,
  categories,
  draftHistory,
}: {
  selections: Selections;
  championMap: Map<string, Champion>;
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  categories: RoleCategories[];
  draftHistory: readonly SavedDraft[];
}): DraftSummary | null {
  const { alliedAdc, alliedSupport, enemyAdc, enemySupport } = selections;
  if (!alliedAdc || !alliedSupport || !enemyAdc || !enemySupport) return null;

  const alliedAdcObj = championMap.get(alliedAdc);
  const alliedSupportObj = championMap.get(alliedSupport);
  if (!alliedAdcObj || !alliedSupportObj) return null;

  const yourLaneArchetype = getLaneArchetype(
    alliedAdc,
    alliedSupport,
    categories
  );
  const enemyLaneArchetype = getLaneArchetype(
    enemyAdc,
    enemySupport,
    categories
  );

  const analysisContext = {
    selections,
    synergyMatrix,
    counterMatrix,
    categories,
    enemyLaneArchetype,
  };

  const currentAnalysis = analyzePair({
    ...analysisContext,
    adc: alliedAdcObj,
    support: alliedSupportObj,
  });
  if (!currentAnalysis) return null;

  const enemySynergy = getSynergyScore(
    enemyAdc,
    enemySupport,
    synergyMatrix,
    true
  );

  const historicalAdjustment = getHistoricalAdjustmentScore(
    selections,
    draftHistory
  );

  const breakdown = [...currentAnalysis.breakdown];
  if (enemySynergy) breakdown.push(enemySynergy);
  if (historicalAdjustment) breakdown.push(historicalAdjustment);

  const overallScore =
    currentAnalysis.weightedScore +
    (enemySynergy?.value ?? 0) +
    (historicalAdjustment?.value ?? 0);

  const allAdcs = [...championMap.values()].filter((c) =>
    c.role.includes("ADC")
  );
  const allSupports = [...championMap.values()].filter((c) =>
    c.role.includes("Support")
  );
  const allPossibleScores = getAllPairs(allAdcs, allSupports)
    .map((pair) => analyzePair({ ...analysisContext, ...pair })?.weightedScore)
    .filter((score): score is number => typeof score === "number");

  const scoreSum = allPossibleScores.reduce((sum, score) => sum + score, 0);
  const avgScore =
    allPossibleScores.length > 0 ? scoreSum / allPossibleScores.length : 0;
  const minScore = Math.min(...allPossibleScores, avgScore);
  const maxScore = Math.max(...allPossibleScores, avgScore);

  let winChance = WIN_CHANCE_CONFIG.AVG;
  if (overallScore >= avgScore && maxScore > avgScore) {
    const range = maxScore - avgScore;
    const progress = (overallScore - avgScore) / range;
    winChance =
      WIN_CHANCE_CONFIG.AVG +
      progress * (WIN_CHANCE_CONFIG.MAX - WIN_CHANCE_CONFIG.AVG);
  } else if (overallScore < avgScore && minScore < avgScore) {
    const range = avgScore - minScore;
    const progress = (avgScore - overallScore) / range;
    winChance =
      WIN_CHANCE_CONFIG.AVG -
      progress * (WIN_CHANCE_CONFIG.AVG - WIN_CHANCE_CONFIG.MIN);
  }

  return {
    overallScore,
    winChance: Math.round(
      Math.max(
        WIN_CHANCE_CONFIG.MIN,
        Math.min(WIN_CHANCE_CONFIG.MAX, winChance)
      )
    ),
    breakdown,
    selections,
    archetypes: { your: yourLaneArchetype, enemy: enemyLaneArchetype },
  };
}
