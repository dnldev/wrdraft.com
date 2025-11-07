/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { TierListData } from "@/data/tierListData";

import { createTierMap } from "./utils";

describe("createTierMap", () => {
  it("should return an empty map for null or undefined input", () => {
    // @ts-expect-error Testing invalid input
    expect(createTierMap(null).size).toBe(0);
    // @ts-expect-error Testing invalid input
    expect(createTierMap(undefined).size).toBe(0);
  });

  it("should return an empty map for an empty tier list object", () => {
    const emptyTierList: TierListData = { adc: {}, support: {} };
    expect(createTierMap(emptyTierList).size).toBe(0);
  });

  it("should correctly map champions from both ADC and Support roles", () => {
    const tierList: TierListData = {
      adc: {
        "S+": ["Jinx"],
        A: ["Caitlyn"],
      },
      support: {
        S: ["Lulu"],
        B: ["Braum"],
      },
    };
    const tierMap = createTierMap(tierList);

    expect(tierMap.size).toBe(4);
    expect(tierMap.get("Jinx")).toBe("S+");
    expect(tierMap.get("Caitlyn")).toBe("A");
    expect(tierMap.get("Lulu")).toBe("S");
    expect(tierMap.get("Braum")).toBe("B");
  });

  it("should handle champions listed in multiple categories, prioritizing the last one found", () => {
    const tierList: TierListData = {
      adc: {
        S: ["Lucian"],
      },
      support: {
        A: ["Lucian"], // Lucian can be played in multiple roles
      },
    };
    const tierMap = createTierMap(tierList);

    // The support list is processed after the ADC list, so it should overwrite the value.
    expect(tierMap.get("Lucian")).toBe("A");
    expect(tierMap.size).toBe(1);
  });

  it("should correctly handle empty arrays within tiers", () => {
    const tierList: TierListData = {
      adc: {
        S: [],
        A: ["Varus"],
      },
      support: {},
    };
    const tierMap = createTierMap(tierList);

    expect(tierMap.size).toBe(1);
    expect(tierMap.get("Varus")).toBe("A");
  });
});
