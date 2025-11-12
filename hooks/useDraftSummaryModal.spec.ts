/**
 * @jest-environment jsdom
 */
import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { DraftSummary } from "@/hooks/useMatchupCalculator";

import { useDraftSummaryModal } from "./useDraftSummaryModal";

const mockSummary: DraftSummary = {
  overallScore: 5,
  winChance: 65,
  breakdown: [],
  selections: {
    alliedAdc: "a",
    alliedSupport: "b",
    enemyAdc: "c",
    enemySupport: "d",
  },
  archetypes: {
    your: "Sustain",
    enemy: "Poke",
  },
};

describe("useDraftSummaryModal", () => {
  jest.useFakeTimers();

  it("should initialize with the modal closed", () => {
    const { result } = renderHook(() => useDraftSummaryModal(null));
    expect(result.current.isSummaryModalOpen).toBe(false);
  });

  it("should not open the modal immediately when a summary is provided", () => {
    const { result } = renderHook(() => useDraftSummaryModal(mockSummary));
    expect(result.current.isSummaryModalOpen).toBe(false);
  });

  it("should open the modal after the delay when a summary is provided", () => {
    const { result } = renderHook(() => useDraftSummaryModal(mockSummary));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.isSummaryModalOpen).toBe(true);
  });

  it("should close the modal when closeSummaryModal is called", () => {
    const { result } = renderHook(() => useDraftSummaryModal(mockSummary));
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.isSummaryModalOpen).toBe(true);
    act(() => {
      result.current.closeSummaryModal();
    });
    expect(result.current.isSummaryModalOpen).toBe(false);
  });

  it("should not reopen the modal after it has been closed (acknowledged)", () => {
    const { result, rerender } = renderHook(
      ({ summary }) => useDraftSummaryModal(summary),
      { initialProps: { summary: mockSummary } }
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      result.current.closeSummaryModal();
    });

    rerender({ summary: { ...mockSummary, overallScore: 10 } });
    act(() => {
      jest.runAllTimers();
    });

    expect(result.current.isSummaryModalOpen).toBe(false);
  });

  it("should allow the modal to be shown again after being reset", () => {
    const { result, rerender } = renderHook(
      ({ summary }) => useDraftSummaryModal(summary),
      { initialProps: { summary: mockSummary } }
    );

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    act(() => {
      result.current.closeSummaryModal();
    });
    act(() => {
      result.current.resetSummaryModal();
    });

    rerender({ summary: { ...mockSummary, overallScore: 10 } });
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.isSummaryModalOpen).toBe(true);
  });
});
