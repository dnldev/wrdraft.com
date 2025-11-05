// FILE: lib/utils.ts
import { TierListData } from "@/data/tierListData";

/**
 * Creates a map of champion names to their meta tier.
 * @param {TierListData} tierList - The tier list data.
 * @returns {Map<string, string>} A map where keys are champion names and values are tiers.
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
