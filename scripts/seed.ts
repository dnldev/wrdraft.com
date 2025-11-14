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

async function backupUserDrafts(kv: Redis): Promise<SavedDraft[]> {
  const allExistingDraftKeys = await kv.keys(`${DRAFT_PREFIX}*`);
  if (allExistingDraftKeys.length === 0) {
    logger.info("- No existing drafts found to preserve.");
    return [];
  }

  const existingDraftStrings = await kv.mget<string[]>(...allExistingDraftKeys);
  const userGeneratedDrafts = existingDraftStrings
    .map((jsonString) => {
      try {
        return jsonString ? (JSON.parse(jsonString) as SavedDraft) : null;
      } catch {
        return null;
      }
    })
    .filter(
      (draft): draft is SavedDraft => !!(draft && !draft.id.startsWith("seed-"))
    );

  logger.info(
    `- Found and preserved ${userGeneratedDrafts.length} user-generated drafts.`
  );
  return userGeneratedDrafts;
}

function prepareSeededDrafts(fullChampionsData: Champion[]): SavedDraft[] {
  const championMap = new Map(fullChampionsData.map((c) => [c.name, c]));
  const synergyMatrix = dataManifest["matrix:synergy"] as Record<
    string,
    Record<string, number>
  >;
  const counterMatrix = dataManifest["matrix:counter"] as Record<
    string,
    Record<string, number>
  >;

  const seededDrafts = historySeedData
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
        const draft: SavedDraft = {
          id: `seed-${index + 1}`,
          timestamp: Date.now() - (historySeedData.length - index) * 86_400_000,
          patch: CURRENT_PATCH,
          result: {
            overallScore: summary.overallScore,
            winChance: summary.winChance,
            breakdown: summary.breakdown,
          },
          archetypes: summary.archetypes,
          ...rawDraft,
        };
        return draft;
      }
      return null;
    })
    .filter((d): d is SavedDraft => d !== null);

  logger.info(
    `- Prepared ${seededDrafts.length} historical drafts for seeding.`
  );
  return seededDrafts;
}

async function syncDraftHistory(kv: Redis, fullChampionsData: Champion[]) {
  logger.info("\nStarting atomic sync of draft history...");

  const userGeneratedDrafts = await backupUserDrafts(kv);
  const seededDrafts = prepareSeededDrafts(fullChampionsData);

  const allOldKeys = await kv.keys(`${DRAFT_PREFIX}*`);
  const keysToDelete = [DRAFTS_KEY, ...allOldKeys];
  if (keysToDelete.length > 1) {
    logger.info(`- Deleting ${keysToDelete.length} old draft-related keys.`);
    await kv.del(...keysToDelete);
  }

  const allDraftsToSave = [...userGeneratedDrafts, ...seededDrafts];
  if (allDraftsToSave.length > 0) {
    const pipeline = kv.pipeline();
    for (const draft of allDraftsToSave) {
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
