import { RoleCategories } from "@/data/categoryData";
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

type Archetype = "Poke" | "Engage" | "Sustain" | "Unknown";
type BreakdownItem = { reason: string; value: number };

const archetypeMap = {
  Hypercarry: "Sustain",
  "Lane Bully": "Engage",
  "Caster/Utility": "Poke",
  "Mobile/Skirmisher": "Engage",
  Enchanter: "Sustain",
  Engage: "Engage",
  "Poke/Mage": "Poke",
  Catcher: "Engage",
};

function getLaneArchetype(
  adcName: string | null,
  supportName: string | null,
  categories: RoleCategories[]
): Archetype {
  const supportRole = categories.find((r) => r.name === "Support");
  if (supportName) {
    for (const category of supportRole?.categories || []) {
      if (category.champions.includes(supportName)) {
        return archetypeMap[
          category.name as keyof typeof archetypeMap
        ] as Archetype;
      }
    }
  }
  const adcRole = categories.find((r) => r.name === "ADC");
  if (adcName) {
    for (const category of adcRole?.categories || []) {
      if (category.champions.includes(adcName)) {
        return archetypeMap[
          category.name as keyof typeof archetypeMap
        ] as Archetype;
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

function getSynergyScore(
  adc: string | null,
  support: string | null,
  roleToCalc: "adc" | "support",
  synergyMatrix: SynergyMatrix
): BreakdownItem | null {
  if (!adc || !support) return null;
  const score = synergyMatrix[adc]?.[support] ?? 0;
  if (score === 0) return null;
  const partner = roleToCalc === "adc" ? support : adc;
  return { value: score, reason: `Synergy with ${partner}` };
}

function getCounterScore(
  championName: string,
  opponentName: string | null,
  counterMatrix: CounterMatrix
): BreakdownItem | null {
  if (!opponentName) return null;
  const score = counterMatrix[championName]?.[opponentName] ?? 0;
  if (score === 0) return null;
  return { value: score, reason: `Matchup vs ${opponentName}` };
}

function sortRecommendations(
  recommendations: Recommendation[]
): Recommendation[] {
  return recommendations.toSorted((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aIsComfort = a.champion.comfort !== null;
    const bIsComfort = b.champion.comfort !== null;
    if (aIsComfort && !bIsComfort) return -1;
    if (!aIsComfort && bIsComfort) return 1;
    return 0;
  });
}

function calculateScoresForChampion(
  champion: Champion,
  context: {
    roleToCalculate: "adc" | "support";
    selections: Selections;
    synergyMatrix: SynergyMatrix;
    counterMatrix: CounterMatrix;
    categories: RoleCategories[];
    enemyLaneArchetype: Archetype;
  }
): Recommendation {
  const {
    roleToCalculate,
    selections,
    synergyMatrix,
    counterMatrix,
    categories,
    enemyLaneArchetype,
  } = context;

  const prospectiveAdc =
    roleToCalculate === "adc" ? champion.name : selections.alliedAdc;
  const prospectiveSupport =
    roleToCalculate === "support" ? champion.name : selections.alliedSupport;

  // FIX: Use nullish coalescing to safely handle undefined values before passing to the function.
  const prospectiveArchetype = getLaneArchetype(
    prospectiveAdc ?? null,
    prospectiveSupport ?? null,
    categories
  );

  const breakdown = [
    getArchetypeScore(prospectiveArchetype, enemyLaneArchetype),
    getSynergyScore(
      prospectiveAdc ?? null,
      prospectiveSupport ?? null,
      roleToCalculate,
      synergyMatrix
    ),
    getCounterScore(champion.name, selections.enemyAdc ?? null, counterMatrix),
    getCounterScore(
      champion.name,
      selections.enemySupport ?? null,
      counterMatrix
    ),
  ].filter((item): item is BreakdownItem => item !== null);

  const score = breakdown.reduce((acc, item) => acc + item.value, 0);

  return { champion, score, breakdown };
}

export function calculateRecommendations({
  roleToCalculate,
  championPool,
  selections,
  synergyMatrix,
  counterMatrix,
  categories,
}: {
  roleToCalculate: "adc" | "support";
  championPool: Champion[];
  selections: Selections;
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  categories: RoleCategories[];
}): Recommendation[] {
  const selectedChampionNames = new Set(
    Object.values(selections).filter(Boolean)
  );
  const availableChampions = championPool.filter(
    (champ) => !selectedChampionNames.has(champ.name)
  );

  // FIX: Use nullish coalescing to safely handle undefined values before passing to the function.
  const enemyLaneArchetype = getLaneArchetype(
    selections.enemyAdc ?? null,
    selections.enemySupport ?? null,
    categories
  );

  const scoringContext = {
    roleToCalculate,
    selections,
    synergyMatrix,
    counterMatrix,
    categories,
    enemyLaneArchetype,
  };

  const results = availableChampions
    .map((champion) => calculateScoresForChampion(champion, scoringContext))
    .filter((result) => result.breakdown.length > 0 && result.score !== 0);

  return sortRecommendations(results);
}
