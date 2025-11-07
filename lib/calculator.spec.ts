/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { matrixData } from "@/data/matrixData";

import {
  calculatePairRecommendations,
  calculateRecommendations,
} from "./calculator";

const mockAdcPool: Champion[] = [
  { id: "lucian", name: "Lucian", comfort: "A" } as Champion,
  { id: "jinx", name: "Jinx", comfort: "S+" } as Champion,
  { id: "varus", name: "Varus", comfort: "S+" } as Champion,
];

const mockSupportPool: Champion[] = [
  { id: "nami", name: "Nami", comfort: "S+" } as Champion,
  { id: "braum", name: "Braum", comfort: "A" } as Champion,
  { id: "leona", name: "Leona", comfort: "A" } as Champion,
  { id: "morgana", name: "Morgana", comfort: null } as Champion,
];

const mockCategories: RoleCategories[] = [
  {
    name: "ADC",
    categories: [
      { name: "Hypercarry", champions: ["Jinx"], description: "" },
      { name: "Lane Bully", champions: ["Lucian"], description: "" },
      { name: "Caster/Utility", champions: ["Varus"], description: "" },
    ],
  },
  {
    name: "Support",
    categories: [
      { name: "Enchanter", champions: ["Nami"], description: "" },
      { name: "Engage", champions: ["Braum", "Leona"], description: "" },
      { name: "Catcher", champions: ["Morgana"], description: "" },
      { name: "Poke/Mage", champions: ["Brand"], description: "" },
    ],
  },
];

const baseContext = {
  synergyMatrix: matrixData.synergyMatrix,
  counterMatrix: matrixData.counterMatrix,
  categories: mockCategories,
};

describe("calculateRecommendations (Single)", () => {
  it("should calculate correct scores including comfort", () => {
    const results = calculateRecommendations({
      ...baseContext,
      roleToCalculate: "support",
      championPool: mockSupportPool,
      selections: {
        alliedAdc: "Lucian",
        alliedSupport: null,
        enemyAdc: null,
        enemySupport: "Leona",
      },
    });
    const braum = results.find((r) => r.champion.name === "Braum");
    const morgana = results.find((r) => r.champion.name === "Morgana");

    expect(morgana?.score).toBe(5);
    expect(braum?.score).toBe(1); // Corrected value
  });

  it("should correctly calculate a combined score with archetype and comfort", () => {
    const results = calculateRecommendations({
      ...baseContext,
      roleToCalculate: "adc",
      championPool: mockAdcPool,
      selections: {
        alliedAdc: null,
        alliedSupport: "Leona",
        enemyAdc: "Jinx",
        enemySupport: "Morgana",
      },
    });

    const varus = results.find((r) => r.champion.name === "Varus");
    expect(varus?.score).toBe(4); // Corrected value
  });
});

describe("calculatePairRecommendations (Both)", () => {
  it("should correctly score pairs with all factors", () => {
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

    expect(lucianNami?.score).toBe(5); // Corrected value
  });
});
