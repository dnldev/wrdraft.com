// lib/stats.spec.ts
/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { SavedDraft, Selections } from "@/types/draft";

import { calculateChampionStats, calculateMatchupPerformance } from "./stats";

const mockHistory: SavedDraft[] = [
  // Game 1: Lucian/Nami WIN vs Caitlyn/Lulu
  {
    id: "game1",
    matchOutcome: "win",
    picks: {
      alliedAdc: "Lucian",
      alliedSupport: "Nami",
      enemyAdc: "Caitlyn",
      enemySupport: "Lulu",
    },
    kda: {
      adc: { k: 10, d: 2, a: 5 },
      support: { k: 1, d: 3, a: 15 },
    },
  } as SavedDraft,
  // Game 2: Lucian/Nami LOSS vs Caitlyn/Lulu
  {
    id: "game2",
    matchOutcome: "loss",
    picks: {
      alliedAdc: "Lucian",
      alliedSupport: "Nami",
      enemyAdc: "Caitlyn",
      enemySupport: "Lulu",
    },
    kda: {
      adc: { k: 4, d: 8, a: 6 },
      support: { k: 0, d: 9, a: 10 },
    },
  } as SavedDraft,
  // Game 3: Jinx/Braum WIN vs a different enemy
  {
    id: "game3",
    matchOutcome: "win",
    picks: {
      alliedAdc: "Jinx",
      alliedSupport: "Braum",
      enemyAdc: "Ashe",
      enemySupport: "Leona",
    },
    kda: {
      adc: { k: 12, d: 1, a: 8 },
      support: { k: 2, d: 2, a: 20 },
    },
  } as SavedDraft,
];

describe("calculateChampionStats", () => {
  const stats = calculateChampionStats(mockHistory);

  it("should correctly calculate stats for a champion with multiple games", () => {
    const lucianStats = stats.get("Lucian");
    expect(lucianStats).toBeDefined();
    expect(lucianStats?.gamesPlayed).toBe(2);
    expect(lucianStats?.wins).toBe(1);
    expect(lucianStats?.losses).toBe(1);
    expect(lucianStats?.winRate).toBe(50);
    expect(lucianStats?.averageKda).toEqual({ k: 7, d: 5, a: 5.5 });
  });

  it("should correctly calculate stats for a champion with one game", () => {
    const jinxStats = stats.get("Jinx");
    expect(jinxStats).toBeDefined();
    expect(jinxStats?.gamesPlayed).toBe(1);
    expect(jinxStats?.winRate).toBe(100);
    expect(jinxStats?.averageKda).toEqual({ k: 12, d: 1, a: 8 });
  });

  it("should not return stats for enemy-only champions", () => {
    expect(stats.has("Caitlyn")).toBe(false);
    expect(stats.has("Lulu")).toBe(false);
  });
});

describe("calculateMatchupPerformance", () => {
  const targetSelections: Selections = {
    alliedAdc: "Lucian",
    alliedSupport: "Nami",
    enemyAdc: "Caitlyn",
    enemySupport: "Lulu",
  };

  it("should return null if no games match the selections", () => {
    const performance = calculateMatchupPerformance(
      { ...targetSelections, alliedAdc: "Varus" },
      mockHistory
    );
    expect(performance).toBeNull();
  });

  it("should correctly calculate performance for a specific matchup", () => {
    const performance = calculateMatchupPerformance(
      targetSelections,
      mockHistory
    );
    expect(performance).not.toBeNull();
    expect(performance?.gamesPlayed).toBe(2);
    expect(performance?.wins).toBe(1);
    expect(performance?.losses).toBe(1);
    expect(performance?.winRate).toBe(50);
  });
});
