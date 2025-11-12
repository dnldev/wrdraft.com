import { flatMap } from "lodash-es";

import { RoleCategories } from "@/data/categoryData";
import { Champion, ComfortTier } from "@/data/championData";
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

function getComfortScore(champion: Champion): BreakdownItem | null {
  if (!champion.comfort) {
    return null;
  }
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
      if (category.champions.includes(supportName)) {
        return archetypeMap[category.name];
      }
    }
  }
  const adcRole = categories.find((r) => r.name === "ADC");
  if (adcName) {
    for (const category of adcRole?.categories || []) {
      if (category.champions.includes(adcName)) {
        return archetypeMap[category.name];
      }
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

  if (advantages[allied] === enemy) {
    return {
      value: archetypeScoreValue,
      reason: `Archetype Advantage (${allied} > ${enemy})`,
    };
  }
  return {
    value: -archetypeScoreValue,
    reason: `Archetype Disadvantage (${allied} < ${enemy})`,
  };
}

/**
 * Calculates the synergy score for a given ADC/Support pair.
 * This will always return a breakdown item, even for a score of 0,
 * to ensure the reason is consistently present in the final analysis.
 * @returns {BreakdownItem | null} The breakdown item or null if inputs are missing.
 */
function getSynergyScore(
  adc: string | null,
  support: string | null,
  synergyMatrix: SynergyMatrix
): BreakdownItem | null {
  if (!adc || !support) return null;
  const score = synergyMatrix[adc]?.[support] ?? 0;
  return { value: score, reason: `Synergy with ${support}` };
}

/**
 * Calculates the counter score between two champions.
 * This will always return a breakdown item, even for a score of 0,
 * to ensure the reason is consistently present in the final analysis.
 * @returns {BreakdownItem | null} The breakdown item or null if inputs are missing.
 */
function getCounterScore(
  championName: string,
  opponentName: string | null,
  counterMatrix: CounterMatrix
): BreakdownItem | null {
  if (!opponentName) return null;
  const score = counterMatrix[championName]?.[opponentName] ?? 0;
  return { value: score, reason: `${championName} vs ${opponentName}` };
}

/**
 * Analyzes a single ADC/Support pair and returns a full breakdown of their score.
 */
export function analyzePair(context: {
  readonly adc: Champion;
  readonly support: Champion;
  readonly selections: Selections;
  readonly synergyMatrix: SynergyMatrix;
  readonly counterMatrix: CounterMatrix;
  readonly categories: readonly RoleCategories[];
  readonly enemyLaneArchetype: Archetype;
}): PairRecommendation {
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

  const totalScore = breakdown.reduce((sum, item) => sum + item.value, 0);

  return { adc, support, score: totalScore, breakdown };
}

function getAllPairs(
  adcs: readonly Champion[],
  supports: readonly Champion[]
): { adc: Champion; support: Champion }[] {
  return flatMap(adcs, (adc) => supports.map((support) => ({ adc, support })));
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
  const {
    adcs,
    supports,
    selections,
    synergyMatrix,
    counterMatrix,
    categories,
    championMap,
  } = context;

  const enemyLaneArchetype = getLaneArchetype(
    selections.enemyAdc,
    selections.enemySupport,
    categories
  );

  const adcsToIterate = selections.alliedAdc
    ? [championMap.get(selections.alliedAdc)].filter(
        (c): c is Champion => c !== undefined
      )
    : adcs;
  const supportsToIterate = selections.alliedSupport
    ? [championMap.get(selections.alliedSupport)].filter(
        (c): c is Champion => c !== undefined
      )
    : supports;

  const allPossiblePairs = getAllPairs(adcsToIterate, supportsToIterate);

  const recommendations = allPossiblePairs
    .map(({ adc, support }) =>
      analyzePair({
        adc,
        support,
        selections,
        synergyMatrix,
        counterMatrix,
        categories,
        enemyLaneArchetype,
      })
    )
    .filter((pair) => pair.score > 0);

  return recommendations.toSorted((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const aComfort = (a.adc.comfort ? 1 : 0) + (a.support.comfort ? 1 : 0);
    const bComfort = (b.adc.comfort ? 1 : 0) + (b.support.comfort ? 1 : 0);
    return bComfort - aComfort;
  });
}
