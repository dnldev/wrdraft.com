import "dotenv/config";

import dotenv from "dotenv";
import { createClient } from "redis";

import { champions as baseChampions } from "@/data/championData.js";
import { dataManifest } from "@/data/data-manifest.js";
import { matchupData } from "@/data/matchupData.js";
import { logger } from "@/lib/logger";

dotenv.config({ path: ".env.development.local" });

async function main() {
  if (!process.env.REDIS_URL) {
    logger.error("Missing Vercel Redis environment variable REDIS_URL.");
    throw new Error("Missing Vercel Redis environment variable REDIS_URL.");
  }

  const redis = createClient({ url: process.env.REDIS_URL });
  await redis.connect();
  logger.info("Successfully connected to Vercel Redis for seeding.");

  await redis.flushAll();
  logger.info("Cleared existing Redis data.");

  const multi = redis.multi();

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

  for (const champion of fullChampionsData) {
    multi.set(`champion:${champion.id}`, JSON.stringify(champion));
  }
  logger.info("- Staging individual champion data...");

  const adcs = fullChampionsData.filter((c) => c.role.includes("ADC"));
  const supports = fullChampionsData.filter((c) => c.role.includes("Support"));
  multi.set("champions:adc", JSON.stringify(adcs));
  multi.set("champions:support", JSON.stringify(supports));
  logger.info("- Staging ADC and Support lists...");

  logger.info("\nStaging data from manifest...");
  for (const [key, data] of Object.entries(dataManifest)) {
    multi.set(key, JSON.stringify(data));
    logger.info({ key }, `- Staging data for key: ${key}`);
  }

  await multi.exec();

  await redis.disconnect();
  logger.info("\n✅ Data seeding complete!");
}

main().catch(async (error) => {
  logger.error(error, "❌ Error seeding data:");
});
