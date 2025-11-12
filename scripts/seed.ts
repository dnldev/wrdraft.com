// This MUST be the first line to ensure env vars are loaded before anything else.
import dotenv from "dotenv";

import { champions as baseChampions } from "@/data/championData.js";
import { dataManifest } from "@/data/data-manifest.js";
import { matchupData } from "@/data/matchupData.js";
import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash.js";

dotenv.config({ path: ".env.development.local" });

const KEY_PREFIX = "WR:";

/**
 * Seeds or updates the Upstash database with static game data.
 * This is a non-destructive operation; it will overwrite existing static data keys
 * but will not delete any other data (like user-generated match history).
 */
async function main() {
  const kv = getKvClient();
  await kv.ping();
  logger.info("Successfully connected to Upstash Redis for seeding.");

  logger.info("Starting non-destructive seeding process...");

  const fullChampionsData = baseChampions.map((champ) => {
    const newMatchups = matchupData.find((m) => m.name === champ.name);
    return {
      ...champ,
      matchups: {
        ...champ.matchups,
        goodAgainst: newMatchups?.goodAgainst || champ.matchups.goodAgainst,
        badAgainst: newMatchups?.badAgainst || champ.matchups.badAgainst,
      },
    };
  });

  const pipeline = kv.pipeline();

  for (const champion of fullChampionsData) {
    pipeline.set(
      `${KEY_PREFIX}champion:${champion.id}`,
      JSON.stringify(champion)
    );
  }
  logger.info("- Staging individual champion data...");

  const adcs = fullChampionsData.filter((c) => c.role.includes("ADC"));
  const supports = fullChampionsData.filter((c) => c.role.includes("Support"));
  pipeline.set(`${KEY_PREFIX}champions:adc`, JSON.stringify(adcs));
  pipeline.set(`${KEY_PREFIX}champions:support`, JSON.stringify(supports));
  logger.info("- Staging ADC and Support lists...");

  logger.info("\nStaging data from manifest...");
  for (const [key, data] of Object.entries(dataManifest)) {
    pipeline.set(`${KEY_PREFIX}${key}`, JSON.stringify(data));
    logger.info({ key: `${KEY_PREFIX}${key}` }, `- Staging data for key`);
  }

  await pipeline.exec();

  logger.info("\n✅ Data seeding/update complete!");
}

try {
  await main();
} catch (error) {
  logger.error(error, "❌ Error seeding data:");
  throw error;
}
