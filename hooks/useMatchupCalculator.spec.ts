/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";

import { useMatchupCalculator } from "./useMatchupCalculator";

// Setup comprehensive mock data for the hook
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
};

describe("useMatchupCalculator", () => {
  it("should initialize with default state", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));

    expect(result.current.roleToCalculate).toBe("adc");
    expect(result.current.selections.alliedAdc).toBeNull();
    expect(result.current.results).toBeNull();
    expect(result.current.isCalculating).toBe(false);
  });

  it("should update a selection and clear results", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));

    act(() => {
      result.current.handleSelectionChange("enemySupport", "Nami");
    });

    expect(result.current.selections.enemySupport).toBe("Nami");
    expect(result.current.results).toBeNull();
  });

  it("should change role and clear results", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));

    act(() => {
      result.current.handleRoleChange("support");
    });

    expect(result.current.roleToCalculate).toBe("support");
    expect(result.current.results).toBeNull();
  });

  it("should clear the correct allied champion selection when the role is toggled", () => {
    const { result } = renderHook(() => useMatchupCalculator(mockProps));

    // 1. Set an allied ADC
    act(() => {
      result.current.handleSelectionChange("alliedAdc", "Jinx");
    });
    expect(result.current.selections.alliedAdc).toBe("Jinx");

    // 2. Change role to calculate FOR ADC. This should clear the allied ADC slot.
    act(() => {
      result.current.handleRoleChange("adc");
    });

    expect(result.current.roleToCalculate).toBe("adc");
    expect(result.current.selections.alliedAdc).toBeNull();
  });
});
