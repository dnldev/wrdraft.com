/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { matrixData } from "@/data/matrixData";
import { TierListData } from "@/data/tierListData";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";

import { useMatchupCalculator } from "./useMatchupCalculator";

// Setup a more comprehensive mock pool for varied testing
const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", comfort: "A" } as Champion,
  { id: "jinx", name: "Jinx", comfort: null } as Champion,
  { id: "ashe", name: "Ashe", comfort: null } as Champion,
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", comfort: null } as Champion,
  { id: "braum", name: "Braum", comfort: "A" } as Champion,
  { id: "morgana", name: "Morgana", comfort: null } as Champion,
];

const mockAllChampions = [...mockAdcPool, ...mockSupportPool];

const mockProps = {
  adcs: mockAdcPool,
  supports: mockSupportPool,
  allChampions: mockAllChampions,
  synergyMatrix: matrixData.synergyMatrix as SynergyMatrix,
  counterMatrix: matrixData.counterMatrix as CounterMatrix,
  firstPicks: { adcs: [], supports: [] } as FirstPickData,
  tierList: { adc: {}, support: {} } as TierListData,
  categories: [] as RoleCategories[],
  bannedChampions: new Set<string>(),
};

describe("useMatchupCalculator", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));
    expect(result.current.selections.alliedAdc).toBeNull();
    expect(result.current.results).toBeNull();
    expect(result.current.isCalculating).toBe(false);
  });

  it("should update a selection", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));
    act(() => {
      result.current.handleSelectionChange("enemySupport", "Nami");
    });
    expect(result.current.selections.enemySupport).toBe("Nami");
  });

  describe("draftSummary", () => {
    it("should be null if not all champions are selected", () => {
      const { result } = renderHook(() => useMatchupCalculator(mockProps));
      act(() => {
        result.current.handleSelectionChange("alliedAdc", "Lucian");
        result.current.handleSelectionChange("alliedSupport", "Nami");
        result.current.handleSelectionChange("enemyAdc", "Jinx");
      });
      expect(result.current.draftSummary).toBeNull();
    });

    it("should calculate a summary when all champions are selected", () => {
      const { result } = renderHook(() =>
        useMatchupCalculator({
          ...mockProps,
          allChampions: [
            ...mockAllChampions,
            { id: "jinx", name: "Jinx" } as Champion,
            { id: "milio", name: "Milio" } as Champion, // Add missing champs
          ],
        })
      );
      act(() => {
        // This matchup (Lucian/Braum vs Jinx/Milio) has a clearly positive score
        result.current.handleSelectionChange("alliedAdc", "Lucian");
        result.current.handleSelectionChange("alliedSupport", "Braum");
        result.current.handleSelectionChange("enemyAdc", "Jinx");
        result.current.handleSelectionChange("enemySupport", "Milio");
      });
      expect(result.current.draftSummary).not.toBeNull();
      expect(result.current.draftSummary?.overallScore).toBeDefined();
      expect(result.current.draftSummary?.winChance).toBeGreaterThan(0);
    });

    it("should calculate a negative score for a bad matchup", () => {
      const { result } = renderHook(() =>
        useMatchupCalculator({
          ...mockProps,
          allChampions: [
            ...mockAllChampions,
            { id: "draven", name: "Draven", comfort: null } as Champion,
            { id: "leona", name: "Leona", comfort: null } as Champion,
          ],
        })
      );
      act(() => {
        result.current.handleSelectionChange("alliedAdc", "Jinx");
        result.current.handleSelectionChange("alliedSupport", "Nami");
        result.current.handleSelectionChange("enemyAdc", "Draven");
        result.current.handleSelectionChange("enemySupport", "Leona");
      });

      // Assert that a summary object is returned, not null.
      expect(result.current.draftSummary).not.toBeNull();
      // Assert that the calculated score is negative, as expected.
      expect(result.current.draftSummary?.overallScore).toBeLessThan(0);
    });
  });
});
