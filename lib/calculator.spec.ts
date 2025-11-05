/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData";

import { calculateRecommendations } from "./calculator";

// Mock data now includes comfort status
const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", comfort: "☆ S Comfort" } as Champion,
  { id: "jinx", name: "Jinx", comfort: "★ S+ Comfort" } as Champion,
  { id: "varus", name: "Varus", comfort: null } as Champion,
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", comfort: "★ S+ Comfort" } as Champion,
  { id: "braum", name: "Braum", comfort: null } as Champion,
  { id: "leona", name: "Leona", comfort: "☆ S Comfort" } as Champion,
];

const fullSynergyMatrix = matrixData.synergyMatrix;
const fullCounterMatrix = matrixData.counterMatrix;

describe("calculateRecommendations", () => {
  it("should only return results with non-zero interactions", () => {
    const results = calculateRecommendations({
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: { alliedSupport: "Bard" },
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
    });
    // Varus and Lucian both have a synergy score of 1 with Bard.
    // Jinx has a score of 0, so she should be filtered out.
    expect(results.length).toBe(2);
    expect(results.find((r) => r.champion.name === "Jinx")).toBeUndefined();
  });

  it("should filter out already selected champions from the results", () => {
    const results = calculateRecommendations({
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: { alliedSupport: "Braum", enemyAdc: "Lucian" }, // Lucian is in the pool and selected
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
    });
    expect(results.length).toBe(2);
    expect(results.find((r) => r.champion.name === "Lucian")).toBeUndefined();
  });

  it("should prioritize comfort picks when scores are equal", () => {
    // Nami, Leona, and Braum get a score of +3 from Lucian synergy.
    // Sorting order should be: Nami (S+ comfort), Leona (S comfort), Braum (no comfort).
    const results = calculateRecommendations({
      roleToCalculate: "support",
      championPool: mockSupportPool,
      selections: { alliedAdc: "Lucian" },
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
    });
    expect(results.length).toBe(3);
    expect(results[0].champion.name).toBe("Nami");
    expect(results[1].champion.name).toBe("Leona");
    expect(results[2].champion.name).toBe("Braum");
  });

  it("should correctly calculate a combined score and sort results", () => {
    const results = calculateRecommendations({
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: {
        alliedSupport: "Braum",
        enemyAdc: "Caitlyn",
        enemySupport: "Leona",
      },
      synergyMatrix: fullSynergyMatrix,
      counterMatrix: fullCounterMatrix,
    });
    // Expected scores: Lucian = 2, Jinx = -1, Varus = -2
    expect(results.length).toBe(3);
    expect(results[0].champion.name).toBe("Lucian");
    expect(results[0].score).toBe(2);
    expect(results[1].champion.name).toBe("Jinx");
    expect(results[1].score).toBe(-1);
  });
});
