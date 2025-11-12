import { flatMap } from "lodash-es";

import { RoleCategories } from "@/data/categoryData";
import { Champion, ComfortTier } from "@/data/championData";
import { DraftSummary } from "@/hooks/useMatchupCalculator";
import { Selections } from "@/types/draft";

import { CounterMatrix, SynergyMatrix } from "./data-fetching";

export interface PairRecommendation {
  readonly adc: Champion;
  readonly support: Champion;
  readonly score: number;
  readonly breakdown: BreakdownItem[];
}

export type Archetype = "Poke" | "Engage" | "Sustain" | "Unknown";
export type BreakdownItem = { readonly reason: string; readonly value: number };

const archetypeMap: Record<string, Archetype> = {
  Hypercarry: "Sustain",
  "Lane Bully": "Engage",
  "Caster/Utility": "Poke",
  "Mobile/Skirmisher": "Engage",
  Enchanter: "Sustain",
  Engage: "Engage",
  "Poke/Mage": "Poke",
  Catcher: "Engage",
};

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
  COUNTER: 1.5, // Counters are 50% more impactful
};

const WIN_CHANCE_CONFIG = {
  MIN: 10,
  AVG: 50,
  MAX: 90,
};

function getComfortScore(champion: Champion): BreakdownItem | null {
  if (!champion.comfort) return null;
  const score = comfortScores[champion.comfort];
  return score > 0
    ? { value: score, reason: `Comfort Pick (${champion.comfort})` }
    : null;
}

export function getLaneArchetype(
  adcName: string | null,
  supportName: string | null,
  categories: readonly RoleCategories[]
): Archetype {
  const supportRole = categories.find((r) => r.name === "Support");
  if (supportName) {
    for (const category of supportRole?.categories || []) {
      if (category.champions.includes(supportName))
        return archetypeMap[category.name];
    }
  }
  const adcRole = categories.find((r) => r.name === "ADC");
  if (adcName) {
    for (const category of adcRole?.categories || []) {
      if (category.champions.includes(adcName))
        return archetypeMap[category.name];
    }
  }
  return "Unknown";
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
  const reason = isEnemy ? "Enemy Team Synergy" : `Synergy with ${support}`;
  return { value: score, reason };
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

/**
 * Analyzes a single champion pair to determine its unweighted and weighted scores.
 * @param context - The context required for the analysis.
 * @returns An object containing the pair, their scores, and the breakdown.
 */
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
  unweightedScore: number;
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

  let unweightedScore = 0;
  let weightedScore = 0;
  for (const item of breakdown) {
    unweightedScore += item.value;

    let weight = 1;
    if (item.reason.includes("Comfort")) weight = WEIGHTS.COMFORT;
    if (item.reason.includes("Archetype")) weight = WEIGHTS.ARCHETYPE;
    if (item.reason.includes("Synergy")) weight = WEIGHTS.SYNERGY;
    if (item.reason.includes("vs")) weight = WEIGHTS.COUNTER;
    weightedScore += item.value * weight;
  }

  return {
    adc,
    support,
    unweightedScore,
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

/**
 * Determines the list of champions to iterate over for a specific role.
 * @param selectedChampion - The name of the currently selected champion for the role, if any.
 * @param championPool - The full list of available champions for the role.
 * @param championMap - A map of all champions by name.
 * @returns A readonly array of champions to be used in calculations.
 */
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

/**
 * Calculates a simple comfort score for a pair, used as a sort tie-breaker.
 * @param pair - The recommendation pair.
 * @returns A numeric score based on the comfort level of the champions.
 */
function getComfortScoreForPair(pair: PairRecommendation): number {
  const adcComfort = pair.adc.comfort ? 1 : 0;
  const supportComfort = pair.support.comfort ? 1 : 0;
  return adcComfort + supportComfort;
}

/**
 * Sorts pair recommendations primarily by score, and secondarily by comfort.
 * @param a - The first recommendation to compare.
 * @param b - The second recommendation to compare.
 * @returns A number indicating the sort order.
 */
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
      return []; // Use flatMap to filter out non-positive scores
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

/**
 * Calculates the final draft summary, including a normalized, weighted score and win chance.
 * @param {object} context - The context required for the calculation.
 * @returns {DraftSummary | null} The complete draft summary or null if selections are incomplete.
 */
export function createDraftSummary({
  selections,
  championMap,
  synergyMatrix,
  counterMatrix,
  categories,
}: {
  selections: Selections;
  championMap: Map<string, Champion>;
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  categories: RoleCategories[];
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

  const yourSynergy =
    getSynergyScore(alliedAdc, alliedSupport, synergyMatrix) ??
    ({ value: 0 } as BreakdownItem);
  const enemySynergy =
    getSynergyScore(enemyAdc, enemySupport, synergyMatrix, true) ??
    ({ value: 0 } as BreakdownItem);

  const breakdown = [
    ...currentAnalysis.breakdown.filter(
      (b) => !b.reason.includes("Synergy with")
    ),
    yourSynergy,
    { ...enemySynergy, value: -enemySynergy.value },
  ];
  const overallScore = currentAnalysis.weightedScore;

  /**
   * Calculates a normalized win chance. It finds the scores for all possible
   * allied pairs, determines the min, max, and average score for the current
   * draft context, and then maps the current pair's score to a win percentage.
   * The average score represents a 50% win chance.
   */
  const allAdcs = [...championMap.values()].filter((c) =>
    c.role.includes("ADC")
  );
  const allSupports = [...championMap.values()].filter((c) =>
    c.role.includes("Support")
  );
  const allPossibleScores = getAllPairs(allAdcs, allSupports)
    .map((pair) => analyzePair({ ...analysisContext, ...pair })?.weightedScore)
    .filter((score): score is number => typeof score === "number");

  let scoreSum = 0;
  for (const score of allPossibleScores) {
    scoreSum += score;
  }
  const avgScore =
    allPossibleScores.length > 0 ? scoreSum / allPossibleScores.length : 0;

  const minScore = Math.min(...allPossibleScores);
  const maxScore = Math.max(...allPossibleScores);

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
