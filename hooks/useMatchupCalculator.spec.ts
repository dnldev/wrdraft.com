/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";

import { useMatchupCalculator } from "./useMatchupCalculator";

const mockProps = {
  adcs: [{ id: "jinx", name: "Jinx" } as Champion],
  supports: [{ id: "nami", name: "Nami" } as Champion],
  allChampions: [
    { id: "jinx", name: "Jinx" } as Champion,
    { id: "nami", name: "Nami" } as Champion,
  ],
  synergyMatrix: {} as SynergyMatrix,
  counterMatrix: {} as CounterMatrix,
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

  it("should not clear selections on its own", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));
    act(() => {
      result.current.handleSelectionChange("alliedAdc", "Jinx");
    });
    expect(result.current.selections.alliedAdc).toBe("Jinx");
    act(() => {
      result.current.handleSelectionChange("enemyAdc", "SomeOtherADC");
    });
    expect(result.current.selections.alliedAdc).toBe("Jinx");
  });

  it("should correctly identify when selections are empty", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));
    expect(result.current.isSelectionEmpty).toBe(true);
    act(() => {
      result.current.handleSelectionChange("alliedAdc", "Jinx");
    });
    expect(result.current.isSelectionEmpty).toBe(false);
    act(() => {
      result.current.handleSelectionChange("alliedAdc", null);
    });
    expect(result.current.isSelectionEmpty).toBe(true);
  });
});
