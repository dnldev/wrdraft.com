import { groupBy, mapValues, sortBy } from "lodash-es";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { dataManifest } from "@/data/data-manifest";
import { FirstPickData } from "@/data/firstPickData";
import { Synergy } from "@/data/synergyData";
import { TeamComposition } from "@/data/teamCompsData";
import { TierListData } from "@/data/tierListData";
import { getConnectedRedisClient } from "@/lib/redis";

import { logger } from "./logger";

export type SynergyMatrix = Record<string, Record<string, number>>;
export type CounterMatrix = Record<string, Record<string, number>>;

/**
 * Defines the shape of the object returned by our main data loader.
 */
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
}

/**
 * Parses the results of a redis.mGet command into a structured object.
 * @param {string[]} keys - The array of keys that were fetched.
 * @param {(string | null)[]} results - The array of stringified JSON results from Redis.
 * @returns {Record<string, unknown>} A map of keys to their parsed JavaScript objects.
 */
function parseRedisMGet(
  keys: string[],
  results: (string | null)[]
): Record<string, unknown> {
  const parsedData: Record<string, unknown> = {};
  for (const [i, key] of keys.entries()) {
    try {
      parsedData[key] = results[i] ? JSON.parse(results[i]) : null;
    } catch (error) {
      logger.error({ key, error }, "Failed to parse JSON for key.");
      parsedData[key] = null;
    }
  }
  return parsedData;
}

/**
 * Processes a raw array of synergy data into objects grouped and sorted by role using Lodash.
 * @param {Synergy[] | null} synergyData - The raw array of synergies.
 * @returns {{ synergiesByAdc: Record<string, Synergy[]>, synergiesBySupport: Record<string, Synergy[]> }} An object containing synergies grouped by ADC and Support.
 */
function processSynergies(synergyData: Synergy[] | null): {
  synergiesByAdc: Record<string, Synergy[]>;
  synergiesBySupport: Record<string, Synergy[]>;
} {
  if (!synergyData) {
    return { synergiesByAdc: {}, synergiesBySupport: {} };
  }

  const ratingOrder: Record<Synergy["rating"], number> = {
    Excellent: 0,
    Good: 1,
    Neutral: 2,
    Poor: 3,
  };

  const sortSynergies = (synergies: Synergy[]) =>
    sortBy(synergies, (s) => ratingOrder[s.rating]);

  const synergiesByAdc = mapValues(groupBy(synergyData, "adc"), sortSynergies);

  const synergiesBySupport = mapValues(
    groupBy(synergyData, "support"),
    sortSynergies
  );

  return { synergiesByAdc, synergiesBySupport };
}

/**
 * Fetches all necessary data for the main page in a single, efficient batch operation.
 * @returns {Promise<PlaybookData>} A promise that resolves to an object containing all page data.
 */
export async function getPlaybookData(): Promise<PlaybookData> {
  const fetchId = Date.now();
  logger.info({ fetchId }, "getPlaybookData: Starting data fetch...");
  const redis = await getConnectedRedisClient();

  const manifestKeys = Object.keys(dataManifest);
  const allKeys = [...manifestKeys, "champions:adc", "champions:support"];

  const results = await redis.mGet(allKeys);
  logger.info(
    { fetchId, keyCount: allKeys.length },
    "getPlaybookData: Fetched data from Redis."
  );
  const parsedData = parseRedisMGet(allKeys, results);

  const { synergiesByAdc, synergiesBySupport } = processSynergies(
    parsedData.synergies as Synergy[] | null
  );

  const adcs = (parsedData["champions:adc"] as Champion[]) || [];
  const supports = (parsedData["champions:support"] as Champion[]) || [];

  logger.info(
    { fetchId },
    "getPlaybookData: Data fetch and processing complete."
  );
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
  };
}
