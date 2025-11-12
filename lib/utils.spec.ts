/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import { RoleCategories } from "@/data/categoryData";
import { TierListData } from "@/data/tierListData";

import { createTierMap, getArchetypeColor, getLaneArchetype } from "./utils";

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
});

describe("getLaneArchetype", () => {
  const mockCategories: RoleCategories[] = [
    {
      name: "ADC",
      categories: [
        { name: "Lane Bully", champions: ["Lucian"], description: "" },
        { name: "Hypercarry", champions: ["Jinx"], description: "" },
      ],
    },
    {
      name: "Support",
      categories: [
        { name: "Enchanter", champions: ["Nami"], description: "" },
        { name: "Engage", champions: ["Leona"], description: "" },
      ],
    },
  ];

  it("should prioritize the support's archetype", () => {
    const archetype = getLaneArchetype("Lucian", "Leona", mockCategories);
    expect(archetype).toBe("Engage");
  });

  it("should fall back to the ADC's archetype if support is not found", () => {
    const archetype = getLaneArchetype(
      "Jinx",
      "UnknownSupport",
      mockCategories
    );
    expect(archetype).toBe("Sustain"); // Hypercarry maps to Sustain
  });

  it("should return 'Unknown' if neither champion is categorized", () => {
    const archetype = getLaneArchetype(
      "UnknownADC",
      "UnknownSupport",
      mockCategories
    );
    expect(archetype).toBe("Unknown");
  });

  it("should return 'Unknown' if one champion is null", () => {
    const archetype = getLaneArchetype("Lucian", null, mockCategories);
    expect(archetype).toBe("Engage"); // Falls back to ADC
  });

  it("should return 'Unknown' if both champions are null", () => {
    const archetype = getLaneArchetype(null, null, mockCategories);
    expect(archetype).toBe("Unknown");
  });
});

describe("getArchetypeColor", () => {
  it('should return "danger" for Engage', () => {
    expect(getArchetypeColor("Engage")).toBe("danger");
  });

  it('should return "primary" for Poke', () => {
    expect(getArchetypeColor("Poke")).toBe("primary");
  });

  it('should return "success" for Sustain', () => {
    expect(getArchetypeColor("Sustain")).toBe("success");
  });

  it('should return "default" for Unknown', () => {
    expect(getArchetypeColor("Unknown")).toBe("default");
  });
});
