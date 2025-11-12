/**
 * @file This file contains the definitive tier list data for various game patches.
 */

/**
 * Defines the structure for a tier list, containing role-specific tiers.
 */
export interface TierListData {
  readonly adc: Record<string, string[]>;
  readonly support: Record<string, string[]>;
}

/**
 * Tier list data for Patch 6.3b.
 */
export const tierList63b: TierListData = {
  adc: {
    "S+": ["Lucian", "Varus"],
    S: ["Jinx", "Xayah", "Jhin", "Miss Fortune", "Caitlyn"],
    A: ["Kai'Sa", "Ashe", "Zeri", "Corki", "Draven", "Ezreal"],
    B: ["Samira", "Tristana", "Vayne"],
    C: ["Sivir"],
  },
  support: {
    "S+": ["Braum", "Nami"],
    S: ["Milio", "Leona", "Bard", "Zilean"],
    A: ["Thresh", "Morgana", "Lulu", "Karma"],
    B: ["Janna", "Lux", "Maokai", "Blitzcrank", "Nautilus"],
    C: ["Swain", "Brand", "Lux"],
  },
};

/**
 * Tier list data for Patch 6.3c.
 */
export const tierList63c: TierListData = {
  adc: {
    "S+": ["Lucian"],
    S: [
      "Jinx",
      "Kai'Sa",
      "Vayne",
      "Samira",
      "Sivir",
      "Caitlyn",
      "Varus",
      "Ezreal",
      "Ashe",
    ],
    A: ["Twitch", "Tristana", "Draven", "Zeri"],
    B: ["Kalista", "Nilah"],
    C: [],
  },
  support: {
    "S+": ["Thresh", "Nami"],
    S: ["Rakan", "Lulu", "Karma", "Pyke", "Leona"],
    A: ["Braum", "Janna", "Milio", "Nautilus", "Alistar", "Seraphine"],
    B: ["Lux", "Morgana", "Senna", "Sona", "Soraka", "Yuumi"],
    C: ["Zyra", "Brand"],
  },
};
