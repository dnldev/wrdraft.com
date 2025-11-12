import { ChipProps } from "@heroui/react";

import { RoleCategories } from "@/data/categoryData";
import { TierListData } from "@/data/tierListData";

export type Archetype = "Poke" | "Engage" | "Sustain" | "Unknown";

const archetypeMap: Record<string, Archetype> = {
  Hypercarry: "Sustain",
  "Lane Bully": "Engage",
  "Caster/Utility": "Poke",
  "Mobile/Skirmisher": "Engage",
  Enchanter: "Sustain",
  Engage: "Engage",
  "Poke/Mage": "Poke",
  Catcher: "Engage",
};

/**
 * Determines the strategic archetype of a bot lane duo.
 * @param adcName - The name of the ADC.
 * @param supportName - The name of the Support.
 * @param categories - The list of all role categories.
 * @returns {Archetype} The determined archetype for the lane.
 */
export function getLaneArchetype(
  adcName: string | null,
  supportName: string | null,
  categories: readonly RoleCategories[]
): Archetype {
  const supportRole = categories.find((r) => r.name === "Support");
  if (supportName) {
    for (const category of supportRole?.categories || []) {
      if (category.champions.includes(supportName)) {
        return archetypeMap[category.name];
      }
    }
  }
  const adcRole = categories.find((r) => r.name === "ADC");
  if (adcName) {
    for (const category of adcRole?.categories || []) {
      if (category.champions.includes(adcName)) {
        return archetypeMap[category.name];
      }
    }
  }
  return "Unknown";
}

/**
 * Creates a map of champion names to their meta tier for efficient lookups.
 * @param {TierListData} tierList - The tier list data object from Redis.
 * @returns {Map<string, string>} A map where keys are champion names and values are their respective tiers (e.g., 'S+', 'A').
 */
export function createTierMap(tierList: TierListData): Map<string, string> {
  const map = new Map<string, string>();
  if (!tierList) return map;

  for (const [tier, champions] of Object.entries(tierList.adc)) {
    for (const champion of champions) {
      map.set(champion, tier);
    }
  }
  for (const [tier, champions] of Object.entries(tierList.support)) {
    for (const champion of champions) {
      map.set(champion, tier);
    }
  }
  return map;
}

/**
 * Maps a lane archetype to a specific semantic color from the theme.
 * @param {Archetype} archetype - The lane archetype.
 * @returns {ChipProps["color"]} The corresponding color for a Chip component.
 */
export function getArchetypeColor(archetype: Archetype): ChipProps["color"] {
  switch (archetype) {
    case "Engage": {
      return "danger";
    }
    case "Poke": {
      return "primary";
    }
    case "Sustain": {
      return "success";
    }
    default: {
      return "default";
    }
  }
}
