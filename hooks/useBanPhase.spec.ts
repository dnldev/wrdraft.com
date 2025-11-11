/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";

import { useBanPhase } from "./useBanPhase";

type UseBanPhaseReturn = ReturnType<typeof useBanPhase>;

describe("useBanPhase", () => {
  // Use a placeholder for initialization. The type will be inferred by TypeScript
  // from the assignment in the beforeEach block.
  let hookResult: { current: UseBanPhaseReturn };

  beforeEach(() => {
    const { result } = renderHook(() => useBanPhase());
    hookResult = result;
  });

  it("should initialize with default user bans and empty enemy bans", () => {
    expect(hookResult.current.yourBans).toEqual([
      "Nautilus",
      "Blitzcrank",
      "",
      "",
      "",
    ]);
    expect(hookResult.current.enemyBans).toEqual(["", "", "", "", ""]);
    expect(hookResult.current.bansLocked).toBe(false);
  });

  it("should update bans for a given team and index", () => {
    act(() => {
      hookResult.current.handleBanSelection("Zed", "enemy", 0);
    });
    expect(hookResult.current.enemyBans[0]).toBe("Zed");
  });

  it("should toggle a ban off if the same slot is selected again", () => {
    act(() => {
      hookResult.current.handleBanSelection("Zed", "your", 2);
    });
    expect(hookResult.current.yourBans[2]).toBe("Zed");
    act(() => {
      hookResult.current.handleBanSelection("Zed", "your", 2);
    });
    expect(hookResult.current.yourBans[2]).toBe("");
  });

  it("should move a ban if a champion is selected in a new slot", () => {
    act(() => {
      hookResult.current.handleBanSelection("Zed", "your", 2);
    });
    expect(hookResult.current.yourBans).toEqual([
      "Nautilus",
      "Blitzcrank",
      "Zed",
      "",
      "",
    ]);

    act(() => {
      hookResult.current.handleBanSelection("Zed", "your", 4);
    });
    expect(hookResult.current.yourBans).toEqual([
      "Nautilus",
      "Blitzcrank",
      "",
      "",
      "Zed",
    ]);
  });

  it("should correctly update the memoized bannedChampions set", () => {
    expect(hookResult.current.bannedChampions).toEqual(
      new Set(["Nautilus", "Blitzcrank"])
    );
    act(() => {
      hookResult.current.handleBanSelection("Zed", "enemy", 0);
    });
    expect(hookResult.current.bannedChampions).toEqual(
      new Set(["Nautilus", "Blitzcrank", "Zed"])
    );
  });

  it("should update the bansLocked state", () => {
    expect(hookResult.current.bansLocked).toBe(false);
    act(() => {
      hookResult.current.setBansLocked(true);
    });
    expect(hookResult.current.bansLocked).toBe(true);
  });

  it("should overwrite a slot with a new champion", () => {
    act(() => {
      hookResult.current.handleBanSelection("Zed", "your", 2);
    });
    expect(hookResult.current.yourBans[2]).toBe("Zed");
    act(() => {
      hookResult.current.handleBanSelection("Yasuo", "your", 2);
    });
    expect(hookResult.current.yourBans[2]).toBe("Yasuo");
    expect(hookResult.current.bannedChampions).not.toContain("Zed");
    expect(hookResult.current.bannedChampions).toContain("Yasuo");
  });
});
