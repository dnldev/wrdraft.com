/**
 * @file This file serves as the single source of truth for all champion data.
 * It uses a more structured format to support future features like a matchup calculator.
 */

// SECTION 1: TYPE DEFINITIONS
export interface Item {
  name: string;
  icon: string;
}

export interface HowToPlayTip {
  tip: string;
  description: string;
}

export interface Build {
  name: string;
  runes: string;
  core: Item[];
  boots: Item[];
  situational: Item[];
}

export interface Matchups {
  userSynergies: string[];
  metaSynergies: string[];
  goodAgainst: string[];
  badAgainst: string[];
}

export interface Champion {
  id: string; // Changed from number to string to match previous usage
  name: string;
  comfort: string | null;
  role: string;
  howToPlay: HowToPlayTip[];
  matchups: Matchups;
  builds: Build[];
}

// SECTION 2: CHAMPION DATA ARRAY
export const champions: Champion[] = [
  {
    id: "varus",
    name: "Varus",
    comfort: "★ S+ Comfort",
    role: "ADC / Poke / Utility",
    howToPlay: [
      {
        tip: "Decide Build in Draft",
        description:
          "Go Lethality (Poke) if your team is AD-heavy (Zed, Yone) or the enemy is all squishy. Go On-Hit (Attack Speed) if your team lacks consistent damage or the enemy is tanky (Aatrox, Galio).",
      },
      {
        tip: "W-Q Burst",
        description:
          "Your main poke is stacking W (Blight) 3 times with autos, then popping it with a fully-charged Q (Piercing Arrow).",
      },
      {
        tip: "E (Anti-Heal)",
        description:
          "Your E (Hail of Arrows) applies Anti-Heal. Use this first in trades against Nami, Yuumi, or Swain.",
      },
      {
        tip: "R (Self-Peel)",
        description:
          "Your R (Chain of Tendrils) is your only escape. Save it to stop the Zed or Akali diving you.",
      },
    ],
    matchups: {
      userSynergies: [
        "Leona",
        "Braum",
        "Nami",
        "Zilean",
        "Milio",
        "Morgana",
        "Thresh",
      ],
      metaSynergies: ["Nautilus", "Alistar", "Rakan", "Galio", "Lulu", "Janna"],
      goodAgainst: ["Jhin", "Ashe", "Miss Fortune", "Swain", "Aatrox"],
      badAgainst: [
        "Zed",
        "Akali",
        "Fizz",
        "Yone",
        "Katarina",
        "Lucian",
        "Draven",
        "Morgana",
        "Yasuo",
      ],
    },
    builds: [
      {
        name: "Lethality/Poke",
        runes: "Keystone: Aery, Gathering Storm, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Youmuu's Ghostblade",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3142.png",
          },
          {
            name: "Umbral Glaive",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3179.png",
          },
          {
            name: "Serpent's Fang",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6695.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
        ],
      },
      {
        name: "On-Hit/Attack Speed",
        runes:
          "Keystone: Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace",
        core: [
          {
            name: "Blade of the Ruined King",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3153.png",
          },
          {
            name: "Runaan's Hurricane",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3085.png",
          },
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
        ],
      },
    ],
  },
  {
    id: "jinx",
    name: "Jinx",
    comfort: "★ S+ Comfort",
    role: "ADC / Scaling / Hyper-carry",
    howToPlay: [
      {
        tip: "LANE TO FARM",
        description:
          "You are weak early. Your only goal is to farm and not die. Do not fight unless it's a guaranteed kill.",
      },
      {
        tip: "Stance Dance",
        description:
          "Use Q (Minigun) for single-target damage (towers, dragons, duels). Use Q (Rockets) for long-range farming, pushing, and team fighting.",
      },
      {
        tip: "E (Chompers)",
        description:
          "This is your only defense. When Leona or Riven dives you, place your traps directly under your own feet.",
      },
      {
        tip: "Passive (Get Excited!)",
        description:
          "This is your win condition. Once you get one kill or assist, you gain massive speed. Use this to re-position, not just to chase.",
      },
    ],
    matchups: {
      userSynergies: [
        "Milio",
        "Lulu",
        "Braum",
        "Janna",
        "Nami",
        "Zilean",
        "Thresh",
        "Morgana",
      ],
      metaSynergies: ["Yuumi", "Alistar", "Seraphine"],
      goodAgainst: ["Ashe", "Jhin", "Ezreal"],
      badAgainst: [
        "Zed",
        "Akali",
        "Fizz",
        "Yone",
        "Katarina",
        "Riven",
        "Leona",
        "Nautilus",
        "Blitzcrank",
        "Draven",
        "Lucian",
      ],
    },
    builds: [
      {
        name: "Standard Crit",
        runes:
          "Keystone: Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace",
        core: [
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
          {
            name: "Runaan's Hurricane",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3085.png",
          },
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
        ],
      },
    ],
  },
  {
    id: "lucian",
    name: "Lucian",
    comfort: "☆ S Comfort",
    role: "ADC / All-in / Poke",
    howToPlay: [
      {
        tip: "WIN LANE",
        description: "You are an early/mid-game bully. You must get a lead.",
      },
      {
        tip: "Passive Weaving",
        description:
          "Your damage is your Passive (Double-shot). Always weave an auto after every ability: E -> AA -> Q -> AA -> W -> AA.",
      },
      {
        tip: "E (Dash)",
        description:
          "This is your engage and escape. If you dash in aggressively, you have no way out.",
      },
      {
        tip: "R (Culling)",
        description:
          "This is not your main duel damage. Use it to clear waves or finish a running target.",
      },
    ],
    matchups: {
      userSynergies: ["Nami", "Braum", "Leona", "Thresh", "Lulu", "Zilean"],
      metaSynergies: ["Yuumi", "Rakan", "Nautilus"],
      goodAgainst: ["Vayne", "Jinx", "Kai'Sa", "Ashe"],
      badAgainst: ["Caitlyn", "Xayah", "Draven", "Janna", "Alistar"],
    },
    builds: [
      {
        name: "Crit / Ability",
        runes:
          "Keystone: Press the Attack, Triumph, Legend: Bloodline, Coup de Grace",
        core: [
          {
            name: "Navori Quickblades",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6675.png",
          },
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
        ],
      },
    ],
  },
  {
    id: "xayah",
    name: "Xayah",
    comfort: null,
    role: "ADC / Utility / All-in",
    howToPlay: [
      {
        tip: "ANTI-ASSASSIN",
        description:
          "Your R (Featherstorm) makes you untargetable. You are a hard counter-pick to Zed, Akali, Fizz, Yone, and Katarina.",
      },
      {
        tip: "Feather Management",
        description:
          "Your E (Bladecaller) is your main tool. Wait for 3+ feathers to be on the ground behind a target before you press E to root them.",
      },
      {
        tip: "Fast Root Combo",
        description:
          "Q -> Auto-Attack -> E. This is your quickest way to root a target at range.",
      },
      {
        tip: "Kiting",
        description:
          "You are very strong at kiting back. Let enemies (Aatrox, Riven) run into your feathers, then root them with E.",
      },
    ],
    matchups: {
      userSynergies: ["Leona", "Braum", "Bard", "Morgana", "Thresh"],
      metaSynergies: ["Rakan", "Nautilus", "Alistar", "Galio"],
      goodAgainst: ["Zed", "Yone", "Akali", "Fizz", "Katarina", "Lucian"],
      badAgainst: [
        "Caitlyn",
        "Varus",
        "Ezreal",
        "Ziggs",
        "Brand",
        "Lux",
        "Vel'Koz",
        "Yasuo",
      ],
    },
    builds: [
      {
        name: "Standard Crit",
        runes:
          "Keystone: Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace",
        core: [
          {
            name: "Navori Quickblades",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6675.png",
          },
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
        ],
      },
    ],
  },
  {
    id: "jhin",
    name: "Jhin",
    comfort: null,
    role: "ADC / Poke / Utility",
    howToPlay: [
      {
        tip: "4th Shot",
        description:
          "Your 4th auto-attack is an execute. Always save it to poke the enemy champion, not a minion.",
      },
      {
        tip: "W (Root)",
        description:
          "This is a follow-up tool. It only roots targets already damaged by you or an ally. Watch for Leona's E or Braum's Q, then immediately press W.",
      },
      {
        tip: "E (Traps)",
        description:
          "Place these in the river brush to spot ganks. In a fight, drop them under your feet when an assassin (like Zed) dives you.",
      },
      {
        tip: "R (Curtain Call)",
        description:
          "Use this to start a fight from safety (the slow sets up your team) or to finish running enemies. Do not use it in the middle of a team fight.",
      },
    ],
    matchups: {
      userSynergies: ["Leona", "Braum", "Bard", "Zilean", "Morgana", "Thresh"],
      metaSynergies: ["Nautilus", "Lux", "Seraphine", "Ashe"],
      goodAgainst: ["Yuumi", "Senna", "Seraphine"],
      badAgainst: [
        "Leona",
        "Nautilus",
        "Lucian",
        "Draven",
        "Yasuo",
        "Yone",
        "Akali",
        "Fizz",
      ],
    },
    builds: [
      {
        name: "Lethality/Crit",
        runes:
          "Keystone: First Strike (for burst/gold), Triumph, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Youmuu's Ghostblade",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3142.png",
          },
          {
            name: "The Collector",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6676.png",
          },
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
        ],
      },
    ],
  },
  {
    id: "missfortune",
    name: "Miss Fortune",
    comfort: null,
    role: "ADC / Poke / All-in",
    howToPlay: [
      {
        tip: "Q (Bounce)",
        description:
          "Your main poke. Last-hit a back-line minion with Q so the second, critical shot bounces onto the enemy ADC.",
      },
      {
        tip: "E (Slow)",
        description:
          "Use this slow to set up your R (Ult) or to help your Leona land her E.",
      },
      {
        tip: "R (Bullet Time)",
        description:
          "This is your team-fight-winning ability. Never use it unless you are safe or the enemy is CC'd.",
      },
      {
        tip: "W (Speed)",
        description:
          "Use your out-of-combat movement speed to rotate to Dragon or Baron faster than the enemy.",
      },
    ],
    matchups: {
      userSynergies: ["Leona", "Braum", "Bard", "Morgana", "Thresh"],
      metaSynergies: ["Nautilus", "Galio", "Seraphine", "Alistar"],
      goodAgainst: ["Jhin", "Ashe", "Veigar", "Brand", "Ziggs"],
      badAgainst: [
        "Braum",
        "Yasuo",
        "Alistar",
        "Leona",
        "Nautilus",
        "Blitzcrank",
        "Thresh",
        "Janna",
        "Zed",
        "Akali",
        "Fizz",
      ],
    },
    builds: [
      {
        name: "Lethality/Crit",
        runes: "Keystone: First Strike, Triumph, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "The Collector",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6676.png",
          },
          {
            name: "Youmuu's Ghostblade",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3142.png",
          },
          {
            name: "Lord Dominik's Regards",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
        ],
      },
    ],
  },
  {
    id: "caitlyn",
    name: "Caitlyn",
    comfort: null,
    role: "ADC / Poke / Control",
    howToPlay: [
      {
        tip: "Range is Life",
        description:
          "You have the longest base auto-attack range. Use this to harass the enemy every time they try to last-hit a minion.",
      },
      {
        tip: "Trap Combo",
        description:
          "Your main power is your W (Trap). Place traps after your support lands CC (e.g., Morgana Q, Lux Q, Leona E).",
      },
      {
        tip: "E (Net)",
        description:
          "This is your only escape. It also slows the enemy and guarantees a Headshot. Use it defensively.",
      },
      {
        tip: "R (Ult)",
        description:
          "Use this to finish an enemy who escaped a fight. Be warned: Braum and Yasuo can block it.",
      },
    ],
    matchups: {
      userSynergies: ["Morgana", "Leona", "Braum", "Thresh", "Milio"],
      metaSynergies: ["Lux", "Janna", "Lulu", "Karma"],
      goodAgainst: ["Vayne", "Kai'Sa", "Veigar", "Brand"],
      badAgainst: [
        "Leona",
        "Nautilus",
        "Blitzcrank",
        "Yasuo",
        "Varus",
        "Ezreal",
      ],
    },
    builds: [
      {
        name: "Standard Crit",
        runes:
          "Keystone: Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace",
        core: [
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
          {
            name: "Runaan's Hurricane",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3085.png",
          },
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Lord Dominik's",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6672.png",
          },
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
        ],
      },
      {
        name: "Lethality/Poke",
        runes:
          "Keystone: First Strike, Gathering Storm, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Youmuu's Ghostblade",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3142.png",
          },
          {
            name: "The Collector",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6676.png",
          },
          {
            name: "Umbral Glaive",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3179.png",
          },
        ],
        boots: [
          {
            name: "Ionian Boots of Lucidity",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3158.png",
          },
        ],
        situational: [
          {
            name: "Serpent's Fang",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6695.png",
          },
        ],
      },
    ],
  },
  {
    id: "kaisa",
    name: "Kai'Sa",
    comfort: null,
    role: "ADC / All-in / Scaling",
    howToPlay: [
      {
        tip: "Passive is Key",
        description:
          "Your burst comes from your 5-hit passive. You need an engage support to apply stacks for you.",
      },
      {
        tip: "Q (Icathian Rain)",
        description:
          "This is your main wave clear and burst. Try to use it on an isolated target for maximum damage.",
      },
      {
        tip: "W (Void Seeker)",
        description:
          "Use this for long-range poke or to mark an enemy with your passive.",
      },
      {
        tip: "R (Killer Instinct)",
        description:
          'This is an aggressive "dive" tool. Use it to follow your Leona or Nautilus in.',
      },
    ],
    matchups: {
      userSynergies: ["Leona", "Braum", "Thresh", "Morgana"],
      metaSynergies: ["Nautilus", "Alistar", "Rakan", "Galio"],
      goodAgainst: ["Jhin", "Ashe", "Ezreal"],
      badAgainst: ["Caitlyn", "Draven", "Janna", "Lulu"],
    },
    builds: [
      {
        name: "AP/Hybrid",
        runes:
          "Keystone: Lethal Tempo, Triumph, Hunter - Titan, Legend: Alacrity",
        core: [
          {
            name: "Statikk Shiv",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3087.png",
          },
          {
            name: "Nashor's Tooth",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3115.png",
          },
          {
            name: "Rabadon's Deathcap",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3089.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Lich Bane",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3100.png",
          },
          {
            name: "Void Staff",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3135.png",
          },
        ],
      },
      {
        name: "Crit/AD",
        runes:
          "Keystone: Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace",
        core: [
          {
            name: "The Collector",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6676.png",
          },
          {
            name: "Navori Quickblades",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6675.png",
          },
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
        ],
      },
    ],
  },
  {
    id: "ashe",
    name: "Ashe",
    comfort: null,
    role: "ADC / Utility / Poke",
    howToPlay: [
      {
        tip: "W (Volley)",
        description:
          "This is your main tool. Use it to poke, wave clear, and apply a massive slow.",
      },
      {
        tip: "E (Hawkshot)",
        description:
          "Use this to get vision of the enemy jungler, Dragon, or Baron. A well-timed Hawkshot can save your team.",
      },
      {
        tip: "Q (Ranger's Focus)",
        description:
          "This is your main damage. Stack it on minions, then activate it for a massive attack speed steroid.",
      },
      {
        tip: "R (Crystal Arrow)",
        description:
          "A global stun. Use it to engage from across the map, or to self-peel by shooting it point-blank.",
      },
    ],
    matchups: {
      userSynergies: ["Morgana", "Braum", "Milio", "Lulu", "Nami"],
      metaSynergies: ["Lux", "Seraphine", "Karma"],
      goodAgainst: ["Jhin", "Draven", "Aatrox", "Swain"],
      badAgainst: ["Zed", "Akali", "Fizz", "Yone", "Lucian", "Morgana"],
    },
    builds: [
      {
        name: "On-Hit / Utility",
        runes:
          "Keystone: Lethal Tempo, Triumph, Legend: Alacrity, Coup de Grace",
        core: [
          {
            name: "Blade of the Ruined King",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3153.png",
          },
          {
            name: "Runaan's Hurricane",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3085.png",
          },
          {
            name: "Bloodthirster",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3072.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Infinity Edge",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3031.png",
          },
          {
            name: "Mortal Reminder",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6673.png",
          },
        ],
      },
    ],
  },
  {
    id: "braum",
    name: "Braum",
    comfort: null,
    role: "Support / Defensive Engage / Peel",
    howToPlay: [
      {
        tip: "E (Unbreakable)",
        description:
          "This is your defining skill. It deletes the first projectile. Use it to block Miss Fortune R, Caitlyn R, Ezreal R, Nami R, Ashe R.",
      },
      {
        tip: "Passive",
        description:
          "Your Q (Winter's Bite) applies one stack. You need your ADC to apply the next 3. Don't engage if your ADC is too far away.",
      },
      {
        tip: "W (Jump)",
        description:
          "You can jump to allied minions. Use this to jump to a frontline minion, then Q the enemy.",
      },
      {
        tip: "Counter-Engage",
        description:
          "You are a fantastic counter to Leona. Stand in front of your ADC. If she E's, she hits you, and you can just E (Shield), Q her, and win the trade.",
      },
    ],
    matchups: {
      userSynergies: ["Lucian", "Jinx", "Ashe", "Kai'Sa", "Varus", "Xayah"],
      metaSynergies: ["Vayne", "Draven"],
      goodAgainst: [
        "Miss Fortune",
        "Caitlyn",
        "Ezreal",
        "Ashe",
        "Nami",
        "Leona",
      ],
      badAgainst: [
        "Morgana",
        "Brand",
        "Lux",
        "Ziggs",
        "Vel'Koz",
        "Zilean",
        "Janna",
        "Lulu",
      ],
    },
    builds: [
      {
        name: "Tank / Peel",
        runes:
          "Keystone: Guardian or Aftershock, Font of Life, Bone Plating, Overgrowth",
        core: [
          {
            name: "Protector's Vow",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3109.png",
          },
          {
            name: "Winter's Approach",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3011.png",
          },
          {
            name: "Zeke's Convergence",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3050.png",
          },
        ],
        boots: [
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Thornmail",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3075.png",
          },
          {
            name: "Randuin's Omen",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3143.png",
          },
        ],
      },
    ],
  },
  {
    id: "nami",
    name: "Nami",
    comfort: "★ S+ Comfort",
    role: "Support / Poke / Sustain",
    howToPlay: [
      {
        tip: "Aggressive Enchanter",
        description:
          "You win by poking. Your W (Ebb and Flow) is a heal and a poke. Always try to bounce it.",
      },
      {
        tip: "E (Empower)",
        description:
          "This is your primary trading tool. Put it on your Lucian before he dashes to get the empowered double-shot.",
      },
      {
        tip: "Q (Bubble)",
        description:
          "This is a follow-up tool. Use it after an enemy is slowed by your E or hit by your R. Do not lead with it.",
      },
      {
        tip: "R (Tidal Wave)",
        description:
          "This is a massive disengage or engage. Use it to stop a gank, or combo it with a Leona R or Galio R.",
      },
    ],
    matchups: {
      userSynergies: [
        "Lucian",
        "Jinx",
        "Varus",
        "Miss Fortune",
        "Caitlyn",
        "Ashe",
      ],
      metaSynergies: ["Draven", "Ezreal"],
      goodAgainst: ["Braum", "Alistar", "Brand", "Lux"],
      badAgainst: [
        "Leona",
        "Nautilus",
        "Blitzcrank",
        "Thresh",
        "Zed",
        "Fizz",
        "Akali",
        "Yuumi",
      ],
    },
    builds: [
      {
        name: "Enchanter",
        runes: "Keystone: Aery, Triumph, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Ardent Censer",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3504.png",
          },
          {
            name: "Staff of Flowing Water",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6620.png",
          },
        ],
        boots: [
          {
            name: "Ionian Boots of Lucidity",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3158.png",
          },
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Oblivion Orb",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3916.png",
          },
        ],
      },
    ],
  },
  {
    id: "milio",
    name: "Milio",
    comfort: "★ S+ Comfort",
    role: "Support / Sustain / Peel",
    howToPlay: [
      {
        tip: "Anti-Engage",
        description:
          "Your R (Breath of Life) is an AoE Cleanse. This makes you a hard counter-pick to Leona, Nautilus, Varus, and Ashe.",
      },
      {
        tip: "W (Bonus Range)",
        description:
          "Your W (Cozy Campfire) gives bonus attack range. Keep this on your Jinx or Caitlyn at all times.",
      },
      {
        tip: "Q (Bop)",
        description:
          "This is your only peel. Use it to knock away the Leona or Alistar who dives your ADC.",
      },
      {
        tip: "E (Shield)",
        description:
          "This is your shield. It gives movement speed. Use it to help your immobile ADC (like Jinx) dodge skillshots.",
      },
    ],
    matchups: {
      userSynergies: ["Jinx", "Caitlyn", "Ashe", "Varus", "Xayah", "Kai'Sa"],
      metaSynergies: ["Vayne", "Kog'Maw"],
      goodAgainst: [
        "Leona",
        "Nautilus",
        "Ashe",
        "Varus",
        "Lissandra",
        "Veigar",
      ],
      badAgainst: [
        "Blitzcrank",
        "Thresh",
        "Brand",
        "Lux",
        "Ziggs",
        "Lucian",
        "Nami",
      ],
    },
    builds: [
      {
        name: "Enchanter / Peel",
        runes: "Keystone: Aery, Triumph, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Ardent Censer",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3504.png",
          },
          {
            name: "Staff of Flowing Water",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6620.png",
          },
        ],
        boots: [
          {
            name: "Ionian Boots of Lucidity",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3158.png",
          },
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Oblivion Orb",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3916.png",
          },
        ],
      },
    ],
  },
  {
    id: "leona",
    name: "Leona",
    comfort: "☆ S Comfort",
    role: "Support / All-in / Engage",
    howToPlay: [
      {
        tip: "You are the 'Engage' button",
        description:
          "You have no poke. You only fight. Your level 2 and 3 all-in is one of the strongest in the game.",
      },
      {
        tip: "E (Zenith Blade)",
        description:
          "This goes through minions. This is your primary advantage over Thresh or Blitzcrank.",
      },
      {
        tip: "Full Combo",
        description:
          "E -> (while flying) W -> (land) -> Auto-Attack -> Q (Stun) -> Auto-Attack.",
      },
      {
        tip: "R (Solar Flare)",
        description:
          "Use this to start a fight from afar, or after your E-Q combo to chain-CC a target for 4+ seconds.",
      },
    ],
    matchups: {
      userSynergies: [
        "Lucian",
        "Miss Fortune",
        "Jhin",
        "Xayah",
        "Varus",
        "Kai'Sa",
        "Ashe",
      ],
      metaSynergies: ["Draven", "Tristana"],
      goodAgainst: [
        "Nami",
        "Milio",
        "Yuumi",
        "Zilean",
        "Senna",
        "Brand",
        "Lux",
        "Veigar",
        "Seraphine",
      ],
      badAgainst: ["Morgana", "Janna", "Milio", "Alistar", "Braum", "Lulu"],
    },
    builds: [
      {
        name: "Engage Tank",
        runes: "Keystone: Aftershock, Font of Life, Bone Plating, Overgrowth",
        core: [
          {
            name: "Winter's Approach",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3011.png",
          },
          {
            name: "Zeke's Convergence",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3050.png",
          },
          {
            name: "Protector's Vow",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3109.png",
          },
        ],
        boots: [
          {
            name: "Locket Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3190.png",
          },
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Thornmail",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3075.png",
          },
          {
            name: "Abyssal Mask",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3001.png",
          },
        ],
      },
    ],
  },
  {
    id: "bard",
    name: "Bard",
    comfort: null,
    role: "Support / Roaming / Utility",
    howToPlay: [
      {
        tip: "You are a Roamer",
        description:
          "You win by ganking Mid and Jungle, not by winning lane. Collect chimes (passive) for speed, then use E (Portal) to gank.",
      },
      {
        tip: "When to Roam",
        description:
          "The only time you can roam is when your ADC has pushed the minion wave under the enemy tower. Drop a W (Health Pack) for them, then leave.",
      },
      {
        tip: "Q (Stun)",
        description:
          "In lane, poke with your Meep-empowered auto, then Q them into a minion or wall for a stun.",
      },
      {
        tip: "R (Stasis)",
        description:
          "Use this to catch fleeing enemies, to stop a Dragon/Baron attempt, or to disable the enemy turret during a dive.",
      },
    ],
    matchups: {
      userSynergies: ["Jhin", "Xayah", "Varus", "Caitlyn", "Ashe"],
      metaSynergies: ["Ezreal", "Senna"],
      goodAgainst: ["Veigar", "Orianna", "Ziggs", "Aurelion Sol"],
      badAgainst: ["Leona", "Nautilus", "Draven", "Lucian"],
    },
    builds: [
      {
        name: "Utility / AP",
        runes: "Keystone: Electrocute, Triumph, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Rod of Ages",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3027.png",
          },
          {
            name: "Lich Bane",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3100.png",
          },
          {
            name: "Rabadon's Deathcap",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3089.png",
          },
        ],
        boots: [
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Ardent Censer",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3504.png",
          },
          {
            name: "Staff of Flowing Water",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6620.png",
          },
        ],
      },
    ],
  },
  {
    id: "zilean",
    name: "Zilean",
    comfort: null,
    role: "Support / Poke / Utility",
    howToPlay: [
      {
        tip: "Anti-Assassin",
        description:
          "You are the #1 counter-pick to Zed, Fizz, Akali, and Katarina. Your R (Revive) makes their entire job impossible.",
      },
      {
        tip: "Q-W-Q Combo",
        description:
          "This is your main stun. Throw one Q (Time Bomb) on a minion, press W (Rewind), then throw the second Q on the same minion for a surprise AoE stun.",
      },
      {
        tip: "E (Speed)",
        description:
          "Use this to speed up your immobile ADC (like Jinx or Jhin) or to slow an enemy Aatrox or Riven that is running at you.",
      },
      {
        tip: "R (Revive)",
        description:
          "Put this on your carry before they die. Use it at 20% health.",
      },
    ],
    matchups: {
      userSynergies: ["Jinx", "Jhin", "Varus", "Ashe", "Lucian"],
      metaSynergies: ["Caitlyn", "Vayne"],
      goodAgainst: [
        "Zed",
        "Akali",
        "Fizz",
        "Katarina",
        "Yone",
        "Aatrox",
        "Riven",
      ],
      badAgainst: [
        "Nami",
        "Yuumi",
        "Leona",
        "Blitzcrank",
        "Nautilus",
        "Morgana",
      ],
    },
    builds: [
      {
        name: "Utility / AP",
        runes: "Keystone: Aery, Gathering Storm, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Rod of Ages",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3027.png",
          },
          {
            name: "Staff of Flowing Water",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6620.png",
          },
          {
            name: "Rabadon's Deathcap",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3089.png",
          },
        ],
        boots: [
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Morellonomicon",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3165.png",
          },
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
      },
    ],
  },
  {
    id: "thresh",
    name: "Thresh",
    comfort: null,
    role: "Support / Utility / Catcher",
    howToPlay: [
      {
        tip: "The All-Purpose Tool",
        description:
          "You can be an engage support (Q - Hook) or a peel support (E - Flay away). Adapt to the lane.",
      },
      {
        tip: "W (Lantern)",
        description:
          "This is a 'get out of jail free' card for your ADC. Throw it behind them for an easy escape from ganks.",
      },
      {
        tip: "E (Flay)",
        description:
          "This is often better than your hook. You can use it to interrupt dashes like Leona's E, Rakan's W, or Lucian's E.",
      },
      {
        tip: "Q (Hook)",
        description:
          "Don't re-activate Q immediately. After hooking, walk back to pull the enemy further, then E them back.",
      },
    ],
    matchups: {
      userSynergies: [
        "Jinx",
        "Lucian",
        "Jhin",
        "Xayah",
        "Miss Fortune",
        "Varus",
      ],
      metaSynergies: ["Draven", "Kai'Sa", "Caitlyn"],
      goodAgainst: ["Jinx", "Jhin", "Varus", "Ashe", "Nami", "Yuumi", "Zilean"],
      badAgainst: ["Morgana", "Leona", "Alistar", "Braum", "Ezreal"],
    },
    builds: [
      {
        name: "Tank / Utility",
        runes: "Keystone: Aftershock, Font of Life, Bone Plating, Overgrowth",
        core: [
          {
            name: "Winter's Approach",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3011.png",
          },
          {
            name: "Zeke's Convergence",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3050.png",
          },
          {
            name: "Protector's Vow",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3109.png",
          },
        ],
        boots: [
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Thornmail",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3075.png",
          },
          {
            name: "Randuin's Omen",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3143.png",
          },
        ],
      },
    ],
  },
  {
    id: "morgana",
    name: "Morgana",
    comfort: null,
    role: "Support / Anti-CC / Catcher",
    howToPlay: [
      {
        tip: "E (Black Shield)",
        description:
          "This is your single most important ability. It blocks CC. Save it to counter Leona's E, Thresh's Q, Nautilus's R, etc.",
      },
      {
        tip: "Q (Dark Binding)",
        description:
          "This is a 3-second root. It's very slow. Hide in a bush to land it, or use it as a follow-up.",
      },
      {
        tip: "W (Tormented Shadow)",
        description: "Use this to poke and get your support item gold.",
      },
      {
        tip: "R (Soul Shackles)",
        description:
          "This is a close-range 'all-in' tool. R -> Stasis Enchant is a classic combo.",
      },
    ],
    matchups: {
      userSynergies: ["Caitlyn", "Jhin", "Varus", "Miss Fortune", "Jinx"],
      metaSynergies: ["Ezreal", "Ashe"],
      goodAgainst: [
        "Leona",
        "Nautilus",
        "Thresh",
        "Blitzcrank",
        "Ashe",
        "Varus",
        "Zilean",
        "Braum",
      ],
      badAgainst: ["Milio", "Janna", "Brand", "Ziggs", "Vel'Koz", "Ezreal"],
    },
    builds: [
      {
        name: "Utility / AP",
        runes: "Keystone: Aery, Gathering Storm, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Rod of Ages",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3027.png",
          },
          {
            name: "Morellonomicon",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3165.png",
          },
          {
            name: "Rabadon's Deathcap",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3089.png",
          },
        ],
        boots: [
          {
            name: "Stasis Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3157.png",
          },
        ],
        situational: [
          {
            name: "Void Staff",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3135.png",
          },
        ],
      },
    ],
  },
  {
    id: "lulu",
    name: "Lulu",
    comfort: null,
    role: "Support / Peel / Enchanter",
    howToPlay: [
      {
        tip: "The 'No' Button",
        description:
          "Your W (Whimsy / Polymorph) is one of the best single-target CCs. Use it on the enemy Zed, Akali, Yone, or Riven when they dive your ADC.",
      },
      {
        tip: "E (Shield/Pix)",
        description:
          "Use E (Help, Pix!) on your ADC to shield them. This also allows your Q (Glitterlance) to fire from their position.",
      },
      {
        tip: "R (Wild Growth)",
        description:
          "This is a 'get off me' button. Use it on your ADC when they are being dived to knock up all enemies.",
      },
      {
        tip: "Q (Glitterlance)",
        description: "Your main poke. The slow is very effective for kiting.",
      },
    ],
    matchups: {
      userSynergies: ["Jinx", "Ashe", "Kai'Sa", "Varus"],
      metaSynergies: ["Vayne", "Draven"],
      goodAgainst: ["Zed", "Akali", "Yone", "Riven", "Aatrox"],
      badAgainst: [
        "Milio",
        "Nami",
        "Yuumi",
        "Blitzcrank",
        "Brand",
        "Lux",
        "Ziggs",
      ],
    },
    builds: [
      {
        name: "Enchanter / Peel",
        runes: "Keystone: Aery, Triumph, Hunter - Titan, Manaflow Band",
        core: [
          {
            name: "Ardent Censer",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3504.png",
          },
          {
            name: "Staff of Flowing Water",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/6620.png",
          },
        ],
        boots: [
          {
            name: "Redemption Enchant",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3107.png",
          },
        ],
        situational: [
          {
            name: "Oblivion Orb",
            icon: "https://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/3916.png",
          },
        ],
      },
    ],
  },
];
