import { BreakdownItem, PairRecommendation } from "./calculator";

/**
 * A dictionary of concise, data-driven snippets for the summary line.
 */
const explanationSnippets = {
  Comfort: (value: number) => `Comfort Pick (+${value})`,
  Archetype: (value: number) =>
    value > 0 ? `Archetype (+${value})` : `Archetype (${value})`,
  Synergy: (value: number) => `Synergy (+${value})`,
  Counter: (value: number) =>
    value > 0 ? `Counter (+${value})` : `Counter (${value})`,
};

/**
 * Generates a concise, scannable summary from a breakdown array.
 * @param {BreakdownItem[]} breakdown - The breakdown of scores.
 * @returns {string} A short, data-driven string (e.g., "Comfort Pick (+3) | Archetype (+2)").
 */
export function generateSummaryLine(breakdown: BreakdownItem[]): string {
  const parts: string[] = [];

  const comfort = breakdown.find((b) => b.reason.includes("Comfort"));
  if (comfort) parts.push(explanationSnippets.Comfort(comfort.value));

  const archetype = breakdown.find((b) => b.reason.includes("Archetype"));
  if (archetype && archetype.value !== 0) {
    parts.push(explanationSnippets.Archetype(archetype.value));
  }

  const synergy = breakdown.find((b) => b.reason.includes("Synergy"));
  if (synergy) parts.push(explanationSnippets.Synergy(synergy.value));

  let counterTotal = 0;
  for (const item of breakdown) {
    if (item.reason.includes("vs")) {
      counterTotal += item.value;
    }
  }

  if (counterTotal !== 0) parts.push(explanationSnippets.Counter(counterTotal));

  return parts.join(" | ");
}

/**
 * A dictionary of detailed strategic explanations for each archetype matchup.
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

function getArchetypeExplanationSentence(
  archetypeItem: BreakdownItem | undefined
): string | null {
  if (!archetypeItem) return null;

  if (archetypeItem.value > 0) {
    const match = /\((\w+) > (\w+)\)/.exec(archetypeItem.reason);
    return match
      ? archetypeExplanations[
          `${match[1]}-${match[2]}` as keyof typeof archetypeExplanations
        ]
      : null;
  }
  if (archetypeItem.value < 0) {
    const match = /\((\w+) < (\w+)\)/.exec(archetypeItem.reason);
    return match
      ? archetypeExplanations[
          `${match[1]}-${match[2]}` as keyof typeof archetypeExplanations
        ]
      : null;
  }
  return archetypeExplanations.Mirror;
}

function getSynergyExplanationSentence(
  synergyItem: BreakdownItem | undefined,
  adcName: string,
  supportName: string
): string | null {
  if (synergyItem && synergyItem.value >= 2) {
    return `${adcName} and ${supportName} have excellent lane synergy, allowing them to effectively execute their game plan.`;
  }
  return null;
}

function getCounterExplanationSentence(
  counterItems: BreakdownItem[]
): string | null {
  if (counterItems.length === 0) {
    return null;
  }

  let mainCounter = counterItems[0];
  for (const item of counterItems) {
    if (Math.abs(item.value) > Math.abs(mainCounter.value)) {
      mainCounter = item;
    }
  }

  const [who, whom] = mainCounter.reason.split(" vs ");

  if (mainCounter.value > 0) {
    return `Specifically, ${who} provides a strong individual counter into ${whom}, disrupting their effectiveness in lane.`;
  }
  return `However, be aware that ${whom} is a significant counter to ${who}, which could create challenges in that specific matchup.`;
}

export function generatePairExplanation(
  recommendation: PairRecommendation
): string {
  const { adc, support, breakdown } = recommendation;
  const sentences: string[] = [];

  const archetypeSentence = getArchetypeExplanationSentence(
    breakdown.find((b) => b.reason.includes("Archetype"))
  );
  if (archetypeSentence) sentences.push(archetypeSentence);

  const synergySentence = getSynergyExplanationSentence(
    breakdown.find((b) => b.reason.includes("Synergy")),
    adc.name,
    support.name
  );
  if (synergySentence) {
    const prefix = sentences.length > 0 ? "Furthermore, " : "";
    sentences.push(
      prefix +
        synergySentence.charAt(0).toLowerCase() +
        synergySentence.slice(1)
    );
  }

  const counterSentence = getCounterExplanationSentence(
    breakdown.filter((b) => b.reason.includes("vs"))
  );
  if (counterSentence) sentences.push(counterSentence);

  if (sentences.length === 0) {
    return "This is a generally balanced lane combination with minor advantages.";
  }

  return sentences.join("\n\n");
}
