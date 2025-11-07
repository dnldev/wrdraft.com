/**
 * @file This file contains the structured categorization of champions by role and archetype.
 */

/**
 * Defines the structure for a single champion category (e.g., Hypercarry, Enchanter).
 */
export interface Category {
  name: string;
  description: string;
  champions: string[];
}

/**
 * Defines the structure for a role, containing multiple categories.
 */
export interface RoleCategories {
  name: "ADC" | "Support";
  categories: Category[];
}

/**
 * The definitive list of champion categories.
 */
export const categoryData: RoleCategories[] = [
  {
    name: "ADC",
    categories: [
      {
        name: "Hypercarry",
        description:
          "Champions who scale exceptionally well into the late game, often defined by high sustained damage, attack speed, or critical strikes.",
        champions: [
          "Aphelios",
          "Jinx",
          "Kog'Maw",
          "Smolder",
          "Tristana",
          "Twitch",
          "Vayne",
        ],
      },
      {
        name: "Lane Bully",
        description:
          "Champions with strong early-game damage, range, or trading potential, designed to dominate the laning phase.",
        champions: ["Caitlyn", "Draven", "Lucian", "Miss Fortune"],
      },
      {
        name: "Caster/Utility",
        description:
          "Champions who rely significantly on their abilities for damage (often poke) or provide unique utility (like crowd control). This also includes mages played in the bot lane.",
        champions: [
          "Ashe",
          "Corki",
          "Ezreal",
          "Jhin",
          "Senna",
          "Sivir",
          "Varus",
          "Xayah",
          "Ziggs",
        ],
      },
      {
        name: "Mobile/Skirmisher",
        description:
          "Champions defined by high mobility (dashes, resets) that excel at repositioning, dueling, and diving.",
        champions: ["Kai'Sa", "Kalista", "Nilah", "Samira", "Yasuo", "Zeri"],
      },
    ],
  },
  {
    name: "Support",
    categories: [
      {
        name: "Enchanter",
        description:
          "Champions who focus on buffing allies with heals, shields, movement speed, and other enhancements.",
        champions: [
          "Ivern",
          "Janna",
          "Karma",
          "Lulu",
          "Milio",
          "Nami",
          "Renata Glasc",
          "Seraphine",
          "Sona",
          "Soraka",
          "Taric",
          "Yuumi",
          "Zilean",
        ],
      },
      {
        name: "Engage",
        description:
          "Tanky champions (Vanguards or Wardens) who specialize in initiating fights, locking down targets, and absorbing damage.",
        champions: [
          "Alistar",
          "Amumu",
          "Braum",
          "Leona",
          "Maokai",
          "Nautilus",
          "Pantheon",
          "Rakan",
          "Rell",
          "Tahm Kench",
          "Zac",
        ],
      },
      {
        name: "Poke/Mage",
        description:
          "Ranged champions (usually AP-based) who harass enemies from a distance with damaging abilities.",
        champions: [
          "Ashe",
          "Brand",
          "Fiddlesticks",
          "Heimerdinger",
          "Hwei",
          "Lux",
          "Senna",
          "Shaco",
          "Swain",
          "Vel'Koz",
          "Xerath",
          "Zyra",
        ],
      },
      {
        name: "Catcher",
        description:
          "Champions who excel at isolating and disabling a single enemy, often with 'hook' or 'bind' abilities, to create picks.",
        champions: ["Bard", "Blitzcrank", "Morgana", "Pyke", "Thresh"],
      },
    ],
  },
];
