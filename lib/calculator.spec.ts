// FILE: lib/calculator.test.ts
/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData"; // FIX: Import the real data

import { calculateRecommendations } from "./calculator";

// --- MOCK DATA SETUP ---
// Define the pool of champions we are calculating recommendations FOR.
const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian" } as Champion,
  { id: "jinx", name: "Jinx" } as Champion,
  { id: "varus", name: "Varus" } as Champion,
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami" } as Champion,
  { id: "braum", name: "Braum" } as Champion,
  { id: "leona", name: "Leona" } as Champion,
];

// FIX: Use the complete matrices from the actual data file.
const fullSynergyMatrix = matrixData.synergyMatrix;
const fullCounterMatrix = matrixData.counterMatrix;

// --- TEST SUITE ---

describe("calculateRecommendations", () => {
  describe("when calculating for ADC", () => {
    it("should return a score of 0 for all champions if no selections are made", () => {
      const results = calculateRecommendations({
        roleToCalculate: "adc",
        championPool: mockAdcPool,
        selections: {},
        synergyMatrix: fullSynergyMatrix,
        counterMatrix: fullCounterMatrix,
      });

      expect(results).toHaveLength(3);
      for (const result of results) {
        expect(result.score).toBe(0);
      }
    });

    it("should correctly calculate a combined score with full inputs and sort the results", () => {
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

      // SCORES BASED ON FULL MATRIX:
      // Lucian: 3 (Syn w/ Braum) - 2 (vs Caitlyn) + 1 (vs Leona) = 2
      // Jinx:   3 (Syn w/ Braum) - 1 (vs Caitlyn) - 3 (vs Leona) = -1
      // Varus:  2 (Syn w/ Braum) - 2 (vs Caitlyn) - 2 (vs Leona) = -2

      expect(results[0].champion.name).toBe("Lucian");
      expect(results[0].score).toBe(2);

      expect(results[1].champion.name).toBe("Jinx");
      expect(results[1].score).toBe(-1);

      expect(results[2].champion.name).toBe("Varus");
      expect(results[2].score).toBe(-2);
    });

    it("should handle champions not present in the original limited mock data", () => {
      const results = calculateRecommendations({
        roleToCalculate: "adc",
        championPool: mockAdcPool,
        selections: {
          alliedSupport: "Braum",
          enemyAdc: "Xayah", // Not in the old mock
          enemySupport: "Morgana", // Not in the old mock
        },
        synergyMatrix: fullSynergyMatrix,
        counterMatrix: fullCounterMatrix,
      });

      // SCORES BASED ON FULL MATRIX:
      // Lucian: 3 (Syn w/ Braum) - 1 (vs Xayah) - 2 (vs Morgana) = 0
      // Jinx:   3 (Syn w/ Braum) + 0 (vs Xayah) + 0 (vs Morgana) = 3
      // Varus:  2 (Syn w/ Braum) - 1 (vs Xayah) - 2 (vs Morgana) = -1

      expect(results[0].champion.name).toBe("Jinx");
      expect(results[0].score).toBe(3);

      expect(results[1].champion.name).toBe("Lucian");
      expect(results[1].score).toBe(0);

      expect(results[2].champion.name).toBe("Varus");
      expect(results[2].score).toBe(-1);
    });
  });

  describe("when calculating for Support", () => {
    it("should correctly calculate a combined score with full inputs and sort the results", () => {
      const results = calculateRecommendations({
        roleToCalculate: "support",
        championPool: mockSupportPool,
        selections: {
          alliedAdc: "Lucian",
          enemyAdc: "Jinx",
          enemySupport: "Leona",
        },
        synergyMatrix: fullSynergyMatrix,
        counterMatrix: fullCounterMatrix,
      });

      // SCORES BASED ON FULL MATRIX (CORRECTED):
      // Nami:   3 (Syn w/ Lucian) + 0 (vs Jinx) - 3 (vs Leona) = 0
      // Braum:  3 (Syn w/ Lucian) + 0 (vs Jinx) + 2 (vs Leona) = 5
      // Leona:  3 (Syn w/ Lucian) + 3 (vs Jinx) + 0 (vs Leona) = 6

      expect(results[0].champion.name).toBe("Leona");
      expect(results[0].score).toBe(6);
      expect(results[0].breakdown).toEqual(
        expect.arrayContaining([
          { reason: "Synergy with Lucian", value: 3 },
          { reason: "Matchup vs Jinx", value: 3 },
        ])
      );

      expect(results[1].champion.name).toBe("Braum");
      expect(results[1].score).toBe(5);

      expect(results[2].champion.name).toBe("Nami");
      expect(results[2].score).toBe(0);
    });
  });
});
