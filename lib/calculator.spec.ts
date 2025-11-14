/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData";
import { SavedDraft, Selections } from "@/types/draft";

import { calculatePairRecommendations, createDraftSummary } from "./calculator";

const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", role: "ADC", comfort: "A" } as Champion,
  { id: "jinx", name: "Jinx", role: "ADC", comfort: "S+" } as Champion,
  { id: "varus", name: "Varus", role: "ADC", comfort: "S+" } as Champion,
  { id: "caitlyn", name: "Caitlyn", role: "ADC", comfort: null } as Champion,
  { id: "draven", name: "Draven", role: "ADC", comfort: null } as Champion,
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", role: "Support", comfort: "S+" } as Champion,
  { id: "braum", name: "Braum", role: "Support", comfort: "A" } as Champion,
  { id: "leona", name: "Leona", role: "Support", comfort: "A" } as Champion,
  {
    id: "morgana",
    name: "Morgana",
    role: "Support",
    comfort: null,
  } as Champion,
  { id: "milio", name: "Milio", role: "Support", comfort: null } as Champion,
];

const mockAllChampions = [...mockAdcPool, ...mockSupportPool];
const championMap = new Map(mockAllChampions.map((c) => [c.name, c]));

const mockCategories: RoleCategories[] = [
  {
    name: "ADC",
    categories: [
      { name: "Hypercarry", champions: ["Jinx"], description: "" },
      {
        name: "Lane Bully",
        champions: ["Lucian", "Caitlyn", "Draven"],
        description: "",
      },
      { name: "Caster/Utility", champions: ["Varus"], description: "" },
    ],
  },
  {
    name: "Support",
    categories: [
      { name: "Enchanter", champions: ["Nami", "Milio"], description: "" },
      { name: "Engage", champions: ["Braum", "Leona"], description: "" },
      { name: "Catcher", champions: ["Morgana"], description: "" },
    ],
  },
];

const baseContext = {
  synergyMatrix: matrixData.synergyMatrix,
  counterMatrix: matrixData.counterMatrix,
  categories: mockCategories,
  championMap: championMap,
  draftHistory: [] as SavedDraft[],
};

describe("calculatePairRecommendations", () => {
  it("should correctly score pairs with all factors combined", () => {
    const results = calculatePairRecommendations({
      ...baseContext,
      adcs: mockAdcPool,
      supports: mockSupportPool,
      selections: {
        alliedAdc: null,
        alliedSupport: null,
        enemyAdc: "Caitlyn",
        enemySupport: "Morgana",
      },
    });

    const lucianNami = results.find(
      (r) => r.adc.name === "Lucian" && r.support.name === "Nami"
    );
    expect(lucianNami?.score).toBe(5);
  });
});

describe("createDraftSummary (Theoretical Score)", () => {
  it("should calculate a high win chance for a clear winning matchup", () => {
    const summary = createDraftSummary({
      ...baseContext,
      selections: {
        alliedAdc: "Lucian",
        alliedSupport: "Braum",
        enemyAdc: "Jinx",
        enemySupport: "Milio",
      },
    });

    expect(summary).not.toBeNull();
    expect(summary!.winChance).toBeGreaterThan(55);
    expect(summary!.overallScore).toBeGreaterThan(0);
  });

  it("should calculate a low win chance for a clear losing matchup", () => {
    const summary = createDraftSummary({
      ...baseContext,
      selections: {
        alliedAdc: "Jinx",
        alliedSupport: "Nami",
        enemyAdc: "Draven",
        enemySupport: "Leona",
      },
    });

    expect(summary).not.toBeNull();
    expect(summary!.winChance).toBeLessThan(40);
    expect(summary!.overallScore).toBeLessThan(0);
  });
});

describe("createDraftSummary (Historical Adjustment)", () => {
  const mockSelections: Selections = {
    alliedAdc: "Lucian",
    alliedSupport: "Nami",
    enemyAdc: "Caitlyn",
    enemySupport: "Morgana",
  };

  const baselineSummary = createDraftSummary({
    ...baseContext,
    selections: mockSelections,
  });
  const baselineScore = baselineSummary!.overallScore;

  it("should not apply an adjustment if there is only one game in history", () => {
    const singleGameHistory: SavedDraft[] = [
      { picks: mockSelections, matchOutcome: "win" } as SavedDraft,
    ];
    const summary = createDraftSummary({
      ...baseContext,
      selections: mockSelections,
      draftHistory: singleGameHistory,
    });
    expect(summary!.overallScore).toBe(baselineScore);
  });

  it("should increase the score and win chance with positive historical performance", () => {
    const positiveHistory: SavedDraft[] = [
      { picks: mockSelections, matchOutcome: "win" } as SavedDraft,
      { picks: mockSelections, matchOutcome: "win" } as SavedDraft,
      { picks: mockSelections, matchOutcome: "win" } as SavedDraft,
      { picks: mockSelections, matchOutcome: "loss" } as SavedDraft,
    ]; // 75% win rate

    const summary = createDraftSummary({
      ...baseContext,
      selections: mockSelections,
      draftHistory: positiveHistory,
    });

    expect(summary!.overallScore).toBeGreaterThan(baselineScore);
    expect(summary!.winChance).toBeGreaterThan(baselineSummary!.winChance);
    expect(
      summary!.breakdown.some((b) => b.reason.includes("Historical"))
    ).toBe(true);
  });

  it("should decrease the score and win chance with negative historical performance", () => {
    const negativeHistory: SavedDraft[] = [
      { picks: mockSelections, matchOutcome: "loss" } as SavedDraft,
      { picks: mockSelections, matchOutcome: "loss" } as SavedDraft,
      { picks: mockSelections, matchOutcome: "loss" } as SavedDraft,
      { picks: mockSelections, matchOutcome: "win" } as SavedDraft,
    ]; // 25% win rate

    const summary = createDraftSummary({
      ...baseContext,
      selections: mockSelections,
      draftHistory: negativeHistory,
    });

    expect(summary!.overallScore).toBeLessThan(baselineScore);
    expect(summary!.winChance).toBeLessThan(baselineSummary!.winChance);
    expect(
      summary!.breakdown.some((b) => b.reason.includes("Historical"))
    ).toBe(true);
  });
});
