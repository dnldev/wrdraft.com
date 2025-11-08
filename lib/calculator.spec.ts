/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData";

import { calculatePairRecommendations } from "./calculator";

const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", comfort: "A" } as Champion, // comfort: +1
  { id: "jinx", name: "Jinx", comfort: "S+" } as Champion, // comfort: +3
  { id: "varus", name: "Varus", comfort: "S+" } as Champion, // comfort: +3
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", comfort: "S+" } as Champion, // comfort: +3
  { id: "braum", name: "Braum", comfort: "A" } as Champion, // comfort: +1
  { id: "leona", name: "Leona", comfort: "A" } as Champion, // comfort: +1
  { id: "morgana", name: "Morgana", comfort: null } as Champion, // comfort: +0
];

const mockAllChampions = [...mockAdcPool, ...mockSupportPool];
const championMap = new Map(mockAllChampions.map((c) => [c.name, c]));

const mockCategories: RoleCategories[] = [
  {
    name: "ADC",
    categories: [
      { name: "Hypercarry", champions: ["Jinx"], description: "" },
      { name: "Lane Bully", champions: ["Lucian"], description: "" },
      { name: "Caster/Utility", champions: ["Varus"], description: "" },
    ],
  },
  {
    name: "Support",
    categories: [
      { name: "Enchanter", champions: ["Nami"], description: "" },
      { name: "Engage", champions: ["Braum", "Leona"], description: "" },
      { name: "Catcher", champions: ["Morgana"], description: "" },
      { name: "Poke/Mage", champions: ["Brand"], description: "" },
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
        enemyAdc: "Caitlyn", // Enemy ADC
        enemySupport: "Morgana", // Enemy Support
      },
    });

    const lucianNami = results.find(
      (r) => r.adc.name === "Lucian" && r.support.name === "Nami"
    );

    // Lucian (Engage) + Nami (Sustain) -> Archetype is Sustain
    // Caitlyn (Lane Bully) + Morgana (Catcher) -> Enemy Archetype is Engage
    // Archetype Score: Sustain < Engage -> -2
    // Synergy (Lucian + Nami): +3
    // Comfort (Lucian 'A'): +1
    // Comfort (Nami 'S+'): +3
    // Lucian vs Caitlyn: -2
    // Lucian vs Morgana: (no data) 0
    // Nami vs Caitlyn: (no data) 0
    // Nami vs Morgana: +2
    // Total: -2 + 3 + 1 + 3 - 2 + 0 + 0 + 2 = 5
    expect(lucianNami?.score).toBe(5);
  });

  it("should return an empty array if no pairs have a positive score", () => {
    const results = calculatePairRecommendations({
      ...baseContext,
      adcs: [{ id: "jinx", name: "Jinx", comfort: null } as Champion],
      supports: [{ id: "nami", name: "Nami", comfort: null } as Champion],
      selections: {
        alliedAdc: null,
        alliedSupport: null,
        enemyAdc: "Draven", // Hard counters Jinx
        enemySupport: "Leona", // Hard counters Nami
      },
    });
    // Jinx vs Draven = -3, Nami vs Leona = -3, Synergy = +1. Total is negative.
    expect(results).toEqual([]);
  });

  it("should correctly filter pools when one allied champion is selected", () => {
    const results = calculatePairRecommendations({
      ...baseContext,
      adcs: mockAdcPool,
      supports: mockSupportPool,
      selections: {
        alliedAdc: "Lucian", // Only Lucian should be considered for ADC
        alliedSupport: null,
        enemyAdc: null,
        enemySupport: null,
      },
    });

    const allAdcsAreLucian = results.every((r) => r.adc.name === "Lucian");
    expect(allAdcsAreLucian).toBe(true);
    expect(results.length).toBeGreaterThan(0); // Should still find pairs with Lucian
  });
});
