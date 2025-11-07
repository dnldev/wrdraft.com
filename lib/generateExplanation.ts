import { Selections } from "@/hooks/useMatchupCalculator";

import {
  BreakdownItem,
  PairRecommendation,
  Recommendation,
} from "./calculator";

/**
 * A dictionary of concise explanations for breakdown reasons.
 */
const explanationSnippets = {
  Comfort: (value: number) => `Comfort Pick +${value}`,
  ArchetypeAdvantage: (value: number) => `Archetype +${value}`,
  ArchetypeDisadvantage: (value: number) => `Archetype ${value}`,
  Synergy: (value: number) => `Synergy +${value}`,
  Counter: (value: number) =>
    value > 0 ? `Counter +${value}` : `Counter ${value}`,
};

/**
 * Generates a concise, scannable summary from a breakdown array.
 * @param {BreakdownItem[]} breakdown - The breakdown of scores.
 * @returns {string} A short, data-driven string.
 */
export function generateSummaryLine(breakdown: BreakdownItem[]): string {
  const parts: string[] = [];

  const comfort = breakdown.find((b) => b.reason.includes("Comfort"));
  if (comfort) parts.push(explanationSnippets.Comfort(comfort.value));

  const archetype = breakdown.find((b) => b.reason.includes("Archetype"));
  if (archetype) {
    if (archetype.value > 0)
      parts.push(explanationSnippets.ArchetypeAdvantage(archetype.value));
    if (archetype.value < 0)
      parts.push(explanationSnippets.ArchetypeDisadvantage(archetype.value));
  }

  const synergy = breakdown.find((b) => b.reason.includes("Synergy"));
  if (synergy) parts.push(explanationSnippets.Synergy(synergy.value));

  const counterTotal = breakdown
    .filter((b) => b.reason.includes("vs"))
    .reduce((acc, item) => acc + item.value, 0);
  if (counterTotal !== 0) parts.push(explanationSnippets.Counter(counterTotal));

  return parts.join(" | ");
}

/**
 * A dictionary of strategic explanations for each archetype matchup.
 */
const archetypeExplanations = {
  "Poke-Engage":
    "Your Poke composition is strong against their Engage lane. The strategy is to whittle down their health from a distance, making it too risky for them to attempt an all-in.",
  "Engage-Sustain":
    "Your All-in/Engage composition has a significant advantage against their Sustain lane. Your goal is to use your burst damage to secure kills faster than they can heal or shield.",
  "Sustain-Poke":
    "Your Sustain composition counters their Poke lane. You can mitigate their harassment with heals and shields, eventually winning the war of attrition as they run out of resources.",
  "Engage-Poke":
    "Your lane has an archetype disadvantage. Their Poke composition can make it difficult to find a good opportunity to engage. You must wait for key cooldowns or gank assistance to find a favorable fight.",
  "Sustain-Engage":
    "Your lane has an archetype disadvantage. Their All-in/Engage composition can burst you down before your heals and shields become effective. Play defensively and avoid their initial engage.",
  "Poke-Sustain":
    "Your lane has an archetype disadvantage. Their Sustain composition can nullify your poke damage. You will need to coordinate burst damage or apply anti-heal to win trades.",
  Mirror:
    "Both lanes share the same archetype. This matchup will be determined by skill, cooldown management, and which side can execute their strategy more effectively.",
};

/**
 * Generates the explanation sentence for the archetype matchup.
 * @param {BreakdownItem | undefined} archetypeItem - The archetype breakdown item.
 * @returns {string | null} The generated sentence or null.
 */
function getArchetypeExplanationSentence(
  archetypeItem: BreakdownItem | undefined
): string | null {
  if (!archetypeItem) return null;

  if (archetypeItem.value > 0) {
    const match = new RegExp(/\(([\w/]+) > ([\w/]+)\)/).exec(
      archetypeItem.reason
    );
    return match
      ? archetypeExplanations[
          `${match[1]}-${match[2]}` as keyof typeof archetypeExplanations
        ]
      : null;
  }
  if (archetypeItem.value < 0) {
    const match = new RegExp(/\(([\w/]+) < ([\w/]+)\)/).exec(
      archetypeItem.reason
    );
    return match
      ? archetypeExplanations[
          `${match[1]}-${match[2]}` as keyof typeof archetypeExplanations
        ]
      : null;
  }
  return archetypeExplanations.Mirror;
}

/**
 * Generates the explanation sentence for the lane synergy.
 * @param {BreakdownItem | undefined} synergyItem - The synergy breakdown item.
 * @param {string} adcName - The name of the ADC.
 * @param {string} supportName - The name of the Support.
 * @returns {string | null} The generated sentence or null.
 */
function getSynergyExplanationSentence(
  synergyItem: BreakdownItem | undefined,
  adcName: string,
  supportName: string
): string | null {
  if (synergyItem && synergyItem.value >= 2) {
    return `Furthermore, ${adcName} and ${supportName} have excellent lane synergy, allowing them to effectively execute their game plan.`;
  }
  return null;
}

/**
 * Generates the explanation sentence for the most impactful counter matchup.
 * @param {BreakdownItem[]} counterItems - The array of counter breakdown items.
 * @returns {string | null} The generated sentence or null.
 */
function getCounterExplanationSentence(
  counterItems: BreakdownItem[]
): string | null {
  const positiveCounters = counterItems.filter((c) => c.value > 0);
  if (positiveCounters.length > 0) {
    const mainCounter = positiveCounters.toSorted(
      (a, b) => b.value - a.value
    )[0];
    const [who, whom] = mainCounter.reason.split(" vs ");
    return `Specifically, ${who} provides a strong individual counter into ${whom}, disrupting their effectiveness in lane.`;
  }
  return null;
}

/**
 * Generates a full, multi-line strategic explanation for a recommended pair.
 * @param {PairRecommendation} recommendation - The pair recommendation object.
 * @returns {string} A formatted string explaining the recommendation.
 */
export function generatePairExplanation(
  recommendation: PairRecommendation
): string {
  const { adc, support, breakdown } = recommendation;
  const archetypeItem = breakdown.find((b) => b.reason.includes("Archetype"));
  const synergyItem = breakdown.find((b) => b.reason.includes("Synergy"));
  const counterItems = breakdown.filter((b) => b.reason.includes("vs"));
  const sentences = [
    getArchetypeExplanationSentence(archetypeItem),
    getSynergyExplanationSentence(synergyItem, adc.name, support.name),
    getCounterExplanationSentence(counterItems),
  ].filter((sentence): sentence is string => sentence !== null);
  if (sentences.length === 0) {
    return "This is a generally balanced lane combination with minor advantages.";
  }
  return sentences.join("\n\n");
}

/**
 * Generates a full strategic explanation for a single champion recommendation.
 * @param {Recommendation} recommendation - The single recommendation object.
 * @param {Selections} selections - The current champion selections.
 * @returns {string} A formatted string explaining the recommendation.
 */
export function generateSingleExplanation(
  recommendation: Recommendation,
  selections: Selections
): string {
  const { champion, breakdown } = recommendation;
  const partner = selections.alliedAdc || selections.alliedSupport;
  const sentences: string[] = [];
  const archetypeItem = breakdown.find((b) => b.reason.includes("Archetype"));
  sentences.push(getArchetypeExplanationSentence(archetypeItem) || "");
  const synergyItem = breakdown.find((b) => b.reason.includes("Synergy"));
  if (synergyItem && synergyItem.value >= 2 && partner) {
    sentences.push(
      `This pick creates an excellent lane synergy with ${partner}, allowing you to effectively execute your game plan.`
    );
  }
  const counterItems = breakdown.filter((b) => b.reason.includes("vs"));
  sentences.push(getCounterExplanationSentence(counterItems) || "");
  const filteredSentences = sentences.filter(Boolean);
  if (filteredSentences.length === 0) {
    return `Picking ${champion.name} provides a generally favorable matchup in this scenario.`;
  }
  return filteredSentences.join("\n\n");
}
