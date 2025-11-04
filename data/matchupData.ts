// in /data/matchupData.ts
export interface MatchupInfo {
  name: string;
  role: string;
  goodAgainst: string[];
  badAgainst: string[];
}

export const matchupData: MatchupInfo[] = [
  {
    name: "Varus",
    role: "ADC",
    goodAgainst: ["Jhin", "Ashe", "Miss Fortune"],
    badAgainst: ["Lucian", "Kai'Sa", "Zed", "Yasuo"],
  },
  {
    name: "Jinx",
    role: "ADC",
    goodAgainst: ["Ashe", "Jhin", "Ezreal"],
    badAgainst: ["Leona", "Nautilus", "Draven", "Zed"],
  },
  {
    name: "Lucian",
    role: "ADC",
    goodAgainst: ["Vayne", "Jinx", "Kai'Sa"],
    badAgainst: ["Caitlyn", "Draven", "Braum", "Janna"],
  },
  {
    name: "Xayah",
    role: "ADC",
    goodAgainst: ["Kai'Sa", "Lucian", "Zed", "Akali"],
    badAgainst: ["Caitlyn", "Varus", "Ziggs", "Ezreal"],
  },
  {
    name: "Jhin",
    role: "ADC",
    goodAgainst: ["Ashe", "Ezreal", "Yuumi"],
    badAgainst: ["Leona", "Lucian", "Zed", "Yasuo"],
  },
  {
    name: "Miss Fortune",
    role: "ADC",
    goodAgainst: ["Jhin", "Ashe", "Jinx"],
    badAgainst: ["Braum", "Yasuo", "Leona", "Zed"],
  },
  {
    name: "Caitlyn",
    role: "ADC",
    goodAgainst: ["Vayne", "Kai'Sa", "Jinx"],
    badAgainst: ["Leona", "Nautilus", "Varus", "Ziggs"],
  },
  {
    name: "Kai'Sa",
    role: "ADC",
    goodAgainst: ["Jhin", "Ashe", "Ezreal"],
    badAgainst: ["Caitlyn", "Draven", "Janna", "Tristana"],
  },
  {
    name: "Ashe",
    role: "ADC",
    goodAgainst: ["Jhin", "Draven", "Aatrox"],
    badAgainst: ["Lucian", "Leona", "Zed", "Fizz"],
  },
  {
    name: "Braum",
    role: "Support",
    goodAgainst: ["Miss Fortune", "Caitlyn", "Nami", "Leona"],
    badAgainst: ["Morgana", "Brand", "Lulu", "Zilean"],
  },
  {
    name: "Nami",
    role: "Support",
    goodAgainst: ["Braum", "Alistar", "Brand"],
    badAgainst: ["Leona", "Nautilus", "Blitzcrank", "Milio"],
  },
  {
    name: "Milio",
    role: "Support",
    goodAgainst: ["Leona", "Nautilus", "Ashe", "Varus"],
    badAgainst: ["Brand", "Ziggs", "Blitzcrank", "Nami"],
  },
  {
    name: "Leona",
    role: "Support",
    goodAgainst: ["Nami", "Janna", "Soraka", "Yuumi"],
    badAgainst: ["Morgana", "Janna", "Milio", "Alistar"],
  },
  {
    name: "Bard",
    role: "Support",
    goodAgainst: ["Yuumi", "Soraka", "Braum"],
    badAgainst: ["Leona", "Nautilus", "Draven", "Thresh"],
  },
  {
    name: "Zilean",
    role: "Support",
    goodAgainst: ["Zed", "Akali", "Fizz", "Katarina"],
    badAgainst: ["Morgana", "Nami", "Blitzcrank", "Milio"],
  },
  {
    name: "Thresh",
    role: "Support",
    goodAgainst: ["Jinx", "Ashe", "Nami"],
    badAgainst: ["Morgana", "Leona", "Alistar", "Milio"],
  },
  {
    name: "Morgana",
    role: "Support",
    goodAgainst: ["Leona", "Nautilus", "Thresh", "Blitzcrank"],
    badAgainst: ["Milio", "Brand", "Ziggs", "Sivir"],
  },
  {
    name: "Lulu",
    role: "Support",
    goodAgainst: ["Zed", "Akali", "Riven", "Master Yi"],
    badAgainst: ["Brand", "Ziggs", "Nami", "Blitzcrank"],
  },
];
