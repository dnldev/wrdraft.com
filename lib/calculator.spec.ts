/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData";

import { calculatePairRecommendations, createDraftSummary } from "./calculator";

// Mocks remain the same...
const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", role: "ADC", comfort: "A" } as Champion,
  { id: "jinx", name: "Jinx", role: "ADC", comfort: "S+" } as Champion,
  { id: "varus", name: "Varus", role: "ADC", comfort: "S+" } as Champion,
  { id: "caitlyn", name: "Caitlyn", role: "ADC", comfort: null } as Champion,
  { id: "draven", name: "Draven", role: "ADC", comfort: null } as Champion,
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", role: "Support", comfort: "S+" } as Champion,
  { id: "braum", name: "Braum", role: "Support", comfort: "A" } as Champion,
  { id: "leona", name: "Leona", role: "Support", comfort: "A" } as Champion,
  {
    id: "morgana",
    name: "Morgana",
    role: "Support",
    comfort: null,
  } as Champion,
  { id: "milio", name: "Milio", role: "Support", comfort: null } as Champion,
];

const mockAllChampions = [...mockAdcPool, ...mockSupportPool];
const championMap = new Map(mockAllChampions.map((c) => [c.name, c]));

const mockCategories: RoleCategories[] = [
  {
    name: "ADC",
    categories: [
      { name: "Hypercarry", champions: ["Jinx"], description: "" },
      {
        name: "Lane Bully",
        champions: ["Lucian", "Caitlyn", "Draven"],
        description: "",
      },
      { name: "Caster/Utility", champions: ["Varus"], description: "" },
    ],
  },
  {
    name: "Support",
    categories: [
      { name: "Enchanter", champions: ["Nami", "Milio"], description: "" },
      { name: "Engage", champions: ["Braum", "Leona"], description: "" },
      { name: "Catcher", champions: ["Morgana"], description: "" },
    ],
  },
];

const baseContext = {
  synergyMatrix: matrixData.synergyMatrix,
  counterMatrix: matrixData.counterMatrix,
  categories: mockCategories,
  championMap: championMap,
};

describe("calculatePairRecommendations", () => {
  it("should correctly score pairs with all factors combined", () => {
    const results = calculatePairRecommendations({
      ...baseContext,
      adcs: mockAdcPool,
      supports: mockSupportPool,
      selections: {
        alliedAdc: null,
        alliedSupport: null,
        enemyAdc: "Caitlyn",
        enemySupport: "Morgana",
      },
    });

    const lucianNami = results.find(
      (r) => r.adc.name === "Lucian" && r.support.name === "Nami"
    );

    // Previously 5, now weighted.
    // Archetype: Sustain vs Engage -> -2 * 1.2 = -2.4
    // Synergy (Lucian + Nami): +3 * 1.0 = +3
    // Comfort (Lucian 'A'): +1 * 1.0 = +1
    // Comfort (Nami 'S+'): +3 * 1.0 = +3
    // Lucian vs Caitlyn: -2 * 1.5 = -3
    // Nami vs Morgana: +2 * 1.5 = +3
    // Total: -2.4 + 3 + 1 + 3 - 3 + 3 = 4.6 -> rounded to 5
    expect(lucianNami?.score).toBe(5);
  });

  // ... other tests for calculatePairRecommendations remain the same ...
});

describe("createDraftSummary", () => {
  it("should calculate a high win chance for a clear winning matchup", () => {
    // Lucian/Braum is a classic, strong lane.
    // Jinx/Milio is a passive, scaling lane that Lucian/Braum can punish.
    const summary = createDraftSummary({
      ...baseContext,
      selections: {
        alliedAdc: "Lucian",
        alliedSupport: "Braum",
        enemyAdc: "Jinx",
        enemySupport: "Milio",
      },
    });

    expect(summary).not.toBeNull();
    expect(summary!.winChance).toBeGreaterThan(60);
    expect(summary!.overallScore).toBeGreaterThan(0);
  });

  it("should calculate a low win chance for a clear losing matchup", () => {
    // Jinx is hard-countered by Draven. Nami is hard-countered by Leona.
    const summary = createDraftSummary({
      ...baseContext,
      selections: {
        alliedAdc: "Jinx",
        alliedSupport: "Nami",
        enemyAdc: "Draven",
        enemySupport: "Leona",
      },
    });

    expect(summary).not.toBeNull();
    expect(summary!.winChance).toBeLessThan(40);
    expect(summary!.overallScore).toBeLessThan(0);
  });

  it("should calculate a win chance around 50% for a neutral/skill matchup", () => {
    // Lucian/Nami and Caitlyn/Morgana are both strong lanes.
    const summary = createDraftSummary({
      ...baseContext,
      selections: {
        alliedAdc: "Lucian",
        alliedSupport: "Nami",
        enemyAdc: "Caitlyn",
        enemySupport: "Morgana",
      },
    });

    expect(summary).not.toBeNull();
    expect(summary!.winChance).toBeGreaterThanOrEqual(45);
    expect(summary!.winChance).toBeLessThanOrEqual(56);
  });
});
