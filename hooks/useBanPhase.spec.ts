/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { useBanPhase } from "./useBanPhase";

describe("useBanPhase", () => {
  it("should initialize with default enemy bans and empty user bans", () => {
    const { result } = renderHook(() => useBanPhase());
    expect(result.current.yourBans).toEqual(["", "", "", "", ""]);
    expect(result.current.enemyBans).toEqual([
      "Blitzcrank",
      "Nautilus",
      "",
      "",
      "",
    ]);
    expect(result.current.bansLocked).toBe(false);
  });

  it("should update bans for a given team and index", () => {
    const { result } = renderHook(() => useBanPhase());
    act(() => {
      result.current.handleBanSelection("Zed", "your", 0);
    });
    expect(result.current.yourBans[0]).toBe("Zed");
  });

  it("should toggle a ban off if the same slot is selected again", () => {
    const { result } = renderHook(() => useBanPhase());
    act(() => {
      result.current.handleBanSelection("Zed", "your", 0);
    });
    expect(result.current.yourBans[0]).toBe("Zed");
    act(() => {
      result.current.handleBanSelection("Zed", "your", 0);
    });
    expect(result.current.yourBans[0]).toBe("");
  });

  it("should move a ban if a champion is selected in a new slot", () => {
    const { result } = renderHook(() => useBanPhase());
    act(() => {
      result.current.handleBanSelection("Zed", "your", 0);
    });
    expect(result.current.yourBans).toEqual(["Zed", "", "", "", ""]);
    act(() => {
      result.current.handleBanSelection("Zed", "your", 2);
    });
    expect(result.current.yourBans).toEqual(["", "", "Zed", "", ""]);
  });

  it("should correctly update the memoized bannedChampions set", () => {
    const { result } = renderHook(() => useBanPhase());
    expect(result.current.bannedChampions).toEqual(
      new Set(["Blitzcrank", "Nautilus"])
    );
    act(() => {
      result.current.handleBanSelection("Zed", "your", 0);
    });
    expect(result.current.bannedChampions).toEqual(
      new Set(["Blitzcrank", "Nautilus", "Zed"])
    );
  });

  it("should update the bansLocked state", () => {
    const { result } = renderHook(() => useBanPhase());
    expect(result.current.bansLocked).toBe(false);
    act(() => {
      result.current.setBansLocked(true);
    });
    expect(result.current.bansLocked).toBe(true);
  });

  it("should overwrite a slot with a new champion", () => {
    const { result } = renderHook(() => useBanPhase());
    act(() => {
      result.current.handleBanSelection("Zed", "your", 1);
    });
    expect(result.current.yourBans[1]).toBe("Zed");
    act(() => {
      result.current.handleBanSelection("Yasuo", "your", 1);
    });
    expect(result.current.yourBans[1]).toBe("Yasuo");
    expect(result.current.bannedChampions).not.toContain("Zed");
    expect(result.current.bannedChampions).toContain("Yasuo");
  });
});
