// FILE: data/firstPickData.ts
export interface FirstPick {
  name: string;
  rating: string;
  reasoning: string;
}

export interface FirstPickData {
  adcs: FirstPick[];
  supports: FirstPick[];
}

export const firstPickData: FirstPickData = {
  adcs: [
    {
      name: "Xayah",
      rating: "S-Tier",
      reasoning:
        "Extremely safe. Her R (Featherstorm) makes her untargetable, countering assassins and divers. The counterMatrix shows almost all neutral or positive matchups, with only Caitlyn (-2) being a soft counter.",
    },
    {
      name: "Caitlyn",
      rating: "S-Tier",
      reasoning:
        "A lane dominant pick. Her superior range gives her a positive matchup into almost every other ADC. Her only weaknesses (-2) are hard engage supports like Leona and Thresh.",
    },
    {
      name: "Kai'Sa",
      rating: "A-Tier",
      reasoning:
        "A flexible pick who can build AD or AP. She has good all-in potential, but the matrix shows she is soft-countered (-2) by long-range (Caitlyn) and anti-dive (Xayah).",
    },
    {
      name: "Lucian",
      rating: "A-Tier",
      reasoning:
        "Very strong in lane with many positive matchups. However, he is not S-Tier because he is synergy-reliant (needs Nami or Leona) and is soft-countered (-2) by Caitlyn and Morgana.",
    },
    {
      name: "Varus",
      rating: "B-Tier",
      reasoning:
        "A flexible build path (poke or on-hit) but has many vulnerabilities. He is hard-countered (-3) by Milio (cleanse) and soft-countered (-2) by Lucian, Caitlyn, Leona, and Morgana.",
    },
    {
      name: "Jinx",
      rating: "C-Tier",
      reasoning:
        "A hyper-carry who is extremely vulnerable. The matrix shows she is hard-countered (-3) by Leona and soft-countered (-2) by Lucian and Thresh. She is not a safe first pick.",
    },
    {
      name: "Ashe",
      rating: "C-Tier",
      reasoning:
        "A utility-focused ADC who is very immobile. She has many soft counters (-2), including Lucian, Milio, Leona, and Morgana. Too easy to punish.",
    },
    {
      name: "Jhin",
      rating: "C-Tier",
      reasoning:
        "Very immobile and easily exploited. He is hard-countered (-3) by Leona and soft-countered (-2) by Thresh. He relies on his support to counter-engage.",
    },
    {
      name: "Miss Fortune",
      rating: "C-Tier",
      reasoning:
        "Immobile, and her ultimate is a liability. She is hard-countered (-3) by Braum (who blocks her R) and soft-countered (-2) by Leona. A very risky first pick.",
    },
  ],
  supports: [
    {
      name: "Milio",
      rating: "S-Tier",
      reasoning:
        "The best first-pick support. His R (Breath of Life) is a hard counter (+3) to engage champs like Leona and Varus. The matrix shows he has almost no bad matchups.",
    },
    {
      name: "Lulu",
      rating: "S-Tier",
      reasoning:
        "Extremely safe and flexible peel. Her W (Polymorph) shuts down divers. The matrix shows she is neutral or positive in almost every matchup, making her very reliable.",
    },
    {
      name: "Bard",
      rating: "S-Tier",
      reasoning:
        "A very safe and flexible pick. His lane is neutral against almost everyone, and his value comes from roaming, which is independent of the 2v2 matchup. Hard to punish.",
    },
    {
      name: "Morgana",
      rating: "A-Tier",
      reasoning:
        "A powerful counter-pick. Her Black Shield (E) provides a hard counter (+3) to Leona, Thresh, and Braum. She is only A-Tier because she can be soft-countered (-2) by poke/sustain like Milio and Zilean.",
    },
    {
      name: "Thresh",
      rating: "B-Tier",
      reasoning:
        "A powerful playmaker who is very flexible (engage or peel). He is risky as a first pick because he is hard-countered (-3) by Morgana, who is a very common support pick.",
    },
    {
      name: "Leona",
      rating: "B-Tier",
      reasoning:
        "An S-Tier engage champion, but a B-Tier *first pick*. She has many dominant matchups, but she is hard-countered (-3) by Milio, Morgana, and Nami (who can bubble her E). Too easy to counter.",
    },
    {
      name: "Braum",
      rating: "C-Tier",
      reasoning:
        "Too many bad matchups. He is hard-countered (-3) by poke (Zilean) and anti-CC (Morgana). He is also soft-countered (-2) by Milio and Lulu. Very situational.",
    },
    {
      name: "Nami",
      rating: "C-Tier",
      reasoning:
        "A strong lane bully who is hard-countered (-3) by all-in engage like Leona. She is also soft-countered (-2) by Thresh. Too vulnerable to be a safe first pick.",
    },
    {
      name: "Zilean",
      rating: "C-Tier",
      reasoning:
        "A niche anti-assassin pick. He is very weak in the laning phase and is soft-countered (-2) by Nami, Milio, Leona, and Morgana. He should only be picked late in the draft.",
    },
  ],
};
