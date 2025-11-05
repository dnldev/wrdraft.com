// in /data/teamCompsData.ts
export interface TeamComposition {
  archetypeId: string;
  name: string;
  description: string;
  strategy: string;
  coreChampions: {
    adcs: string[];
    supports: string[];
  };
  synergisticAllies: string[];
  hardCounters: string[];
}

export const teamCompsData: TeamComposition[] = [
  {
    archetypeId: "engage_dive",
    name: "Engage / Dive",
    description:
      "Force fights with heavy AoE CC and immediate follow-up burst.",
    strategy:
      "Your win condition is the all-in. This composition has the strongest Level 2, 3, and 6. The support (Leona, Thresh) dictates the fight by landing their primary CC. The ADC (Kai'Sa, Xayah) *must* follow up instantly. This comp excels at deleting a single target and winning skirmishes. Your goal is to get a kill, push the wave, and roam to gank mid or invade the enemy jungle.",
    coreChampions: {
      adcs: ["Kai'Sa", "Xayah", "Lucian", "Miss Fortune", "Varus"],
      supports: ["Leona", "Thresh", "Morgana", "Bard"],
    },
    synergisticAllies: [
      "Yasuo",
      "Yone",
      "Akali",
      "Galio",
      "Wukong",
      "Malphite",
      "Jarvan IV",
      "Diana",
    ],
    hardCounters: ["Janna", "Milio", "Lulu", "Morgana", "Braum", "Zilean"],
  },
  {
    archetypeId: "protect_the_carry",
    name: "Protect the Carry",
    description:
      "Funnel all resources and defensive abilities into a single, late-game hyper-carry.",
    strategy:
      "Your win condition is the 25-minute mark. The laning phase is about survival, farming, and scaling. The ADC (Jinx) must focus on last-hitting. The Support (Milio, Lulu) must use all their abilities (shields, heals, anti-CC) to keep the ADC alive during ganks and teamfights. You will likely lose early skirmishes, so do not take them. Your goal is to reach 3 items on your ADC, group as five, and win the game-deciding teamfight.",
    coreChampions: {
      adcs: ["Jinx", "Ashe", "Kai'Sa", "Varus"],
      supports: ["Milio", "Lulu", "Braum", "Janna", "Zilean", "Morgana"],
    },
    synergisticAllies: [
      "Orianna",
      "Galio",
      "Lissandra",
      "Shen",
      "Ornn",
      "Gragas",
    ],
    hardCounters: ["Zed", "Akali", "Fizz", "Katarina", "Blitzcrank", "Thresh"],
  },
  {
    archetypeId: "poke_siege",
    name: "Poke / Siege",
    description:
      "Whittle down enemies from a safe distance to force them off towers and objectives.",
    strategy:
      "Your win condition is the pre-fight. You dominate the lane by constantly harassing the enemy, forcing them to recall or play under their tower. This builds a CS and gold lead. In teamfights, you *must not* get engaged on. Your job is to stand back and rain down abilities (Varus Q, Zilean Q, Jhin R) until the enemy is too low to contest Dragon or Baron. This comp is bad at all-in fights.",
    coreChampions: {
      adcs: ["Varus", "Caitlyn", "Jhin", "Ashe", "Miss Fortune"],
      supports: ["Zilean", "Morgana", "Nami", "Bard", "Lulu"],
    },
    synergisticAllies: [
      "Brand",
      "Lux",
      "Vel'Koz",
      "Ahri",
      "Ziggs",
      "Jayce",
      "Karma",
    ],
    hardCounters: [
      "Leona",
      "Nautilus",
      "Thresh",
      "Blitzcrank",
      "Malphite",
      "Vi",
    ],
  },
  {
    archetypeId: "early_bully",
    name: "Early-Game Bully",
    description:
      "Dominate the 2v2 with high early damage and kill pressure to create a snowball.",
    strategy:
      "Your win condition is the first 10 minutes. This comp has the highest raw damage in the 2v2. You must win the Level 2 race. Once you hit Level 2, you immediately force a fight. The goal is to get kills, deny farm, and take the first tower. This comp falls off if it doesn't get a lead, so you must be aggressive and transition your lane advantage to your jungler and mid laner.",
    coreChampions: {
      adcs: ["Lucian", "Caitlyn", "Miss Fortune"],
      supports: ["Nami", "Leona", "Thresh", "Morgana"],
    },
    synergisticAllies: [
      "Lee Sin",
      "Xin Zhao",
      "Jarvan IV",
      "Renekton",
      "Pantheon",
    ],
    hardCounters: ["Janna", "Braum", "Zilean", "Milio"],
  },
];
