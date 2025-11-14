// lib/data-fetching.ts
import { groupBy, mapValues, sortBy } from "lodash-es";
import { nanoid } from "nanoid";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { dataManifest } from "@/data/data-manifest";
import { FirstPickData } from "@/data/firstPickData";
import { Synergy } from "@/data/synergyData";
import { TeamComposition } from "@/data/teamCompsData";
import { TierListData } from "@/data/tierListData";
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

import { logger } from "./logger";

export type SynergyMatrix = Record<string, Record<string, number>>;
export type CounterMatrix = Record<string, Record<string, number>>;

const KEY_PREFIX = "WR:";
const DRAFTS_KEY = `${KEY_PREFIX}drafts:history`;
const DRAFT_PREFIX = "WR:draft:";

interface PlaybookData {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  synergiesByAdc: Record<string, Synergy[]>;
  synergiesBySupport: Record<string, Synergy[]>;
  teamComps: TeamComposition[];
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  firstPicks: FirstPickData;
  tierList: TierListData;
  categories: RoleCategories[];
  draftHistory: SavedDraft[];
}

/**
 * Fetches, parses, and assembles all necessary data for the main page.
 */
export async function getPlaybookData(): Promise<PlaybookData> {
  const fetchId = nanoid(6);
  logger.info({ fetchId }, "getPlaybookData: Starting data fetch...");
  const kv = getKvClient();

  const baseDataKeys = [
    ...Object.keys(dataManifest),
    "champions:adc",
    "champions:support",
  ];
  const prefixedDataKeys = baseDataKeys.map((key) => `${KEY_PREFIX}${key}`);

  const [mGetResults, draftIds] = await Promise.all([
    kv.mget<unknown[]>(...prefixedDataKeys),
    kv.zrange(DRAFTS_KEY, 0, 99, { rev: true }),
  ]);

  let draftHistory: SavedDraft[] = [];
  if (draftIds.length > 0) {
    const draftKeys = (draftIds as string[]).map(
      (id) => `${DRAFT_PREFIX}${id}`
    );
    const drafts = await kv.mget<SavedDraft[]>(...draftKeys);
    // The Upstash client automatically deserializes JSON strings from Redis.
    // This filter handles cases where a draft might be missing or corrupt.
    draftHistory = drafts.filter((d): d is SavedDraft => d !== null);
  }

  logger.info(
    { fetchId, draftCount: draftHistory.length },
    "getPlaybookData: Fetched and processed data."
  );

  const parsedData: Record<string, unknown> = {};
  for (const [i, key] of baseDataKeys.entries()) {
    parsedData[key] = mGetResults[i] || null;
  }

  const ratingOrder: Record<Synergy["rating"], number> = {
    Excellent: 0,
    Good: 1,
    Neutral: 2,
    Poor: 3,
  };
  const sortSynergies = (synergies: Synergy[]) =>
    sortBy(synergies, (s) => ratingOrder[s.rating]);
  const synergies = parsedData.synergies as Synergy[] | null;
  const synergiesByAdc = synergies
    ? mapValues(groupBy(synergies, "adc"), sortSynergies)
    : {};
  const synergiesBySupport = synergies
    ? mapValues(groupBy(synergies, "support"), sortSynergies)
    : {};

  const adcs = (parsedData["champions:adc"] as Champion[]) || [];
  const supports = (parsedData["champions:support"] as Champion[]) || [];

  return {
    adcs,
    supports,
    allChampions: [...adcs, ...supports],
    synergiesByAdc,
    synergiesBySupport,
    teamComps: (parsedData.teamcomps as TeamComposition[]) || [],
    synergyMatrix: (parsedData["matrix:synergy"] as SynergyMatrix) || {},
    counterMatrix: (parsedData["matrix:counter"] as CounterMatrix) || {},
    firstPicks: (parsedData.firstPicks as FirstPickData) || {
      adcs: [],
      supports: [],
    },
    tierList: (parsedData["data:tierlist"] as TierListData) || {
      adc: {},
      support: {},
    },
    categories: (parsedData["data:categories"] as RoleCategories[]) || [],
    draftHistory,
  };
}
