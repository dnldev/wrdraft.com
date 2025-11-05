export interface TierListData {
  adc: Record<string, string[]>;
  support: Record<string, string[]>;
}

export const tierListData: TierListData = {
  adc: {
    "S+": ["Lucian"],
    S: ["Xayah", "Corki", "Miss Fortune", "Jhin"],
    A: [
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
    B: ["Twitch", "Tristana", "Draven", "Zeri"],
    C: ["Kalista", "Nilah"],
  },
  support: {
    "S+": ["Braum", "Nami", "Zilean"],
    S: [
      "Karma",
      "Lulu",
      "Maokai",
      "Nautilus",
      "Rakan",
      "Pyke",
      "Bard",
      "Milio",
      "Senna",
      "Alistar",
      "Leona",
    ],
    A: [
      "Yuumi",
      "Zyra",
      "Sona",
      "Janna",
      "Seraphine",
      "Soraka",
      "Ornn",
      "Galio",
      "Blitzcrank",
    ],
    B: ["Morgana", "Singed", "Amumu", "Nunu & Willump", "Jarvan IV", "Thresh"],
    C: ["Swain", "Brand", "Lux"],
  },
};
