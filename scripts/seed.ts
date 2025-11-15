// scripts/seed.ts
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

import { categoryData } from "@/data/categoryData.js";
import { Champion, champions as baseChampions } from "@/data/championData.js";
import { dataManifest } from "@/data/data-manifest.js";
import { historySeedData } from "@/data/historySeedData.js";
import { matchupData } from "@/data/matchupData.js";
import { createDraftSummary } from "@/lib/calculator";
import { CURRENT_PATCH } from "@/lib/constants";
import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash.js";
import { SavedDraft } from "@/types/draft";

dotenv.config({ path: ".env.development.local" });

const KEY_PREFIX = "WR:";
const DRAFTS_KEY = `${KEY_PREFIX}drafts:history`;
const DRAFT_PREFIX = "WR:draft:";
const SEED_ID_PREFIX = "seed-";

async function seedStaticData(kv: Redis): Promise<Champion[]> {
  logger.info("Staging static data (champions, matrices, etc.)...");
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

  const staticPipeline = kv.pipeline();
  const adcs = fullChampionsData.filter((c) => c.role.includes("ADC"));
  const supports = fullChampionsData.filter((c) => c.role.includes("Support"));
  staticPipeline.set(`${KEY_PREFIX}champions:adc`, JSON.stringify(adcs));
  staticPipeline.set(
    `${KEY_PREFIX}champions:support`,
    JSON.stringify(supports)
  );

  for (const [key, data] of Object.entries(dataManifest)) {
    staticPipeline.set(`${KEY_PREFIX}${key}`, JSON.stringify(data));
  }
  await staticPipeline.exec();
  logger.info("✅ Static data seeding complete.");
  return fullChampionsData;
}

async function syncDraftHistory(kv: Redis, fullChampionsData: Champion[]) {
  logger.info("\nStarting non-destructive sync of draft history...");

  // 1. Find all existing keys for seeded drafts
  const oldSeededDraftKeys: string[] = [];
  let cursor: string | number = 0;
  do {
    // FIX: Explicitly type the destructured array
    const [nextCursor, keys]: [string, string[]] = await kv.scan(cursor, {
      match: `${DRAFT_PREFIX}${SEED_ID_PREFIX}*`,
    });
    cursor = nextCursor;
    if (keys.length > 0) {
      oldSeededDraftKeys.push(...keys);
    }
  } while (cursor !== "0");

  const oldSeededDraftIds = oldSeededDraftKeys.map((key) =>
    key.replace(DRAFT_PREFIX, "")
  );

  // 2. If old seeded drafts exist, remove them
  if (oldSeededDraftIds.length > 0) {
    logger.info(
      `- Found and removing ${oldSeededDraftIds.length} old seeded drafts.`
    );
    const pipeline = kv.pipeline();
    pipeline.del(...oldSeededDraftKeys);
    pipeline.zrem(DRAFTS_KEY, ...oldSeededDraftIds);
    await pipeline.exec();
  } else {
    logger.info("- No old seeded drafts found to remove.");
  }

  // 3. Prepare the new set of seeded drafts
  const championMap = new Map(fullChampionsData.map((c) => [c.name, c]));
  const synergyMatrix = dataManifest["matrix:synergy"] as Record<
    string,
    Record<string, number>
  >;
  const counterMatrix = dataManifest["matrix:counter"] as Record<
    string,
    Record<string, number>
  >;

  const newSeededDrafts = historySeedData
    .map((rawDraft, index) => {
      const summary = createDraftSummary({
        selections: rawDraft.picks,
        championMap,
        synergyMatrix,
        counterMatrix,
        categories: categoryData,
        draftHistory: [],
      });

      if (summary) {
        return {
          id: `${SEED_ID_PREFIX}${index + 1}`,
          timestamp: Date.now() - (historySeedData.length - index) * 86_400_000,
          patch: CURRENT_PATCH,
          result: {
            overallScore: summary.overallScore,
            winChance: summary.winChance,
            breakdown: summary.breakdown,
          },
          archetypes: summary.archetypes,
          ...rawDraft,
        } as SavedDraft;
      }
      return null;
    })
    .filter((d): d is SavedDraft => d !== null);

  // 4. Add the new seeded drafts to the database
  if (newSeededDrafts.length > 0) {
    logger.info(`- Adding ${newSeededDrafts.length} new seeded drafts.`);
    const pipeline = kv.pipeline();
    for (const draft of newSeededDrafts) {
      pipeline.set(`${DRAFT_PREFIX}${draft.id}`, JSON.stringify(draft));
      pipeline.zadd(DRAFTS_KEY, { score: draft.timestamp, member: draft.id });
    }
    await pipeline.exec();
  }

  const totalDrafts = await kv.zcard(DRAFTS_KEY);
  logger.info(
    `✅ Draft history sync complete. Total drafts in DB: ${totalDrafts}.`
  );
}

async function main() {
  const kv = getKvClient();
  await kv.ping();
  logger.info("Successfully connected to Upstash Redis for seeding.");

  const fullChampionsData = await seedStaticData(kv);
  await syncDraftHistory(kv, fullChampionsData);
}

try {
  await main();
} catch (error) {
  logger.error(error, "❌ Error during seeding process:");
  throw error;
}
