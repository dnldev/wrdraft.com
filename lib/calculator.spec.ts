/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData";

import { calculateRecommendations } from "./calculator";

// MOCK DATA SETUP

const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", comfort: "☆ S Comfort" } as Champion, // Lane Bully -> Engage
  { id: "jinx", name: "Jinx", comfort: "★ S+ Comfort" } as Champion, // Hypercarry -> Sustain
  { id: "varus", name: "Varus", comfort: null } as Champion, // Caster/Utility -> Poke
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", comfort: "★ S+ Comfort" } as Champion, // Enchanter -> Sustain
  { id: "braum", name: "Braum", comfort: null } as Champion, // Engage
  { id: "leona", name: "Leona", comfort: "☆ S Comfort" } as Champion, // Engage
];

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
      { name: "Enchanter", champions: ["Nami", "Lulu"], description: "" },
      { name: "Engage", champions: ["Braum", "Leona"], description: "" },
      { name: "Poke/Mage", champions: ["Morgana"], description: "" },
      { name: "Catcher", champions: ["Thresh"], description: "" },
    ],
  },
];

const fullSynergyMatrix = matrixData.synergyMatrix;
const fullCounterMatrix = matrixData.counterMatrix;

describe("calculateRecommendations", () => {
  it("should only return results with non-zero scores or interactions", () => {
    const results = calculateRecommendations({
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: { alliedSupport: "Bard" }, // Bard synergy with Jinx is 0
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
      categories: mockCategories,
    });
    // Varus (+1) and Lucian (+1) have synergy. Jinx (0) has none.
    expect(results.length).toBe(2);
    expect(results.find((r) => r.champion.name === "Jinx")).toBeUndefined();
  });

  it("should filter out already selected champions from the results", () => {
    const results = calculateRecommendations({
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: { alliedSupport: "Braum", enemyAdc: "Lucian" },
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
      categories: mockCategories,
    });
    expect(results.find((r) => r.champion.name === "Lucian")).toBeUndefined();
  });

  it("should prioritize comfort picks when scores are equal", () => {
    const results = calculateRecommendations({
      roleToCalculate: "support",
      championPool: mockSupportPool,
      selections: { alliedAdc: "Lucian" },
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
      categories: mockCategories,
    });
    // Nami, Leona, and Braum all get a raw score of +3 from Lucian synergy.
    // Sorting order should be: Nami (S+ comfort), Leona (S comfort), Braum (no comfort).
    expect(results.length).toBe(3);
    expect(results[0].champion.name).toBe("Nami");
    expect(results[1].champion.name).toBe("Leona");
    expect(results[2].champion.name).toBe("Braum");
  });

  it("should correctly calculate a combined score including archetype advantage", () => {
    // Setup: Allied support is Lulu (Sustain). Enemy lane is Caitlyn + Leona (Engage archetype).
    const results = calculateRecommendations({
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: {
        alliedSupport: "Lulu",
        enemyAdc: "Caitlyn",
        enemySupport: "Leona",
      },
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
      categories: mockCategories,
    });

    // --- Score Calculation Breakdown ---
    // 1. Lucian (Engage):
    //    - Allied Archetype (Lucian + Lulu) = Sustain (from Lulu)
    //    - Enemy Archetype (Caitlyn + Leona) = Engage (from Leona)
    //    - Archetype vs Enemy (Sustain vs Engage) = -2 (Disadvantage)
    //    - Synergy w/ Lulu = +2
    //    - Counter vs Caitlyn = -2
    //    - Counter vs Leona = +1
    //    - Total = -2 + 2 - 2 + 1 = -1
    const lucianResult = results.find((r) => r.champion.name === "Lucian");
    expect(lucianResult?.score).toBe(-1);

    // 2. Jinx (Sustain):
    //    - Allied Archetype (Jinx + Lulu) = Sustain
    //    - Enemy Archetype = Engage
    //    - Archetype vs Enemy (Sustain vs Engage) = -2 (Disadvantage)
    //    - Synergy w/ Lulu = +3
    //    - Counter vs Caitlyn = -1
    //    - Counter vs Leona = -3
    //    - Total = -2 + 3 - 1 - 3 = -3
    const jinxResult = results.find((r) => r.champion.name === "Jinx");
    expect(jinxResult?.score).toBe(-3);
  });
});
