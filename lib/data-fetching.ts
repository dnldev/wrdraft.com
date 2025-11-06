import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { Synergy } from "@/data/synergyData";
import { TeamComposition } from "@/data/teamCompsData";
import { TierListData } from "@/data/tierListData";
import { getConnectedRedisClient } from "@/lib/redis";

export type SynergyMatrix = Record<string, Record<string, number>>;
export type CounterMatrix = Record<string, Record<string, number>>;

/**
 * Fetches champion category data from Redis.
 * @returns {Promise<RoleCategories[]>} A promise that resolves to the category data.
 */
export async function getCategories(): Promise<RoleCategories[]> {
  const redis = await getConnectedRedisClient();
  const categoriesString = await redis.get("data:categories");
  return categoriesString ? JSON.parse(categoriesString) : [];
}

/**
 * Fetches the meta tier list data from Redis.
 * @returns {Promise<TierListData>} A promise that resolves to the tier list data.
 */
export async function getTierList(): Promise<TierListData> {
  const redis = await getConnectedRedisClient();
  const tierListString = await redis.get("data:tierlist");
  return tierListString ? JSON.parse(tierListString) : { adc: {}, support: {} };
}

/**
 * Fetches the safe first pick data from Redis.
 * @returns {Promise<FirstPickData>} A promise that resolves to the first pick data.
 */
export async function getFirstPicks(): Promise<FirstPickData> {
  const redis = await getConnectedRedisClient();
  const firstPicksString = await redis.get("firstPicks");
  return firstPicksString
    ? JSON.parse(firstPicksString)
    : { adcs: [], supports: [] };
}

/**
 * Fetches all champions (ADCs and Supports) from Redis.
 * @returns {Promise<Champion[]>} A promise that resolves to an array of all champions.
 */
export async function getAllChampions(): Promise<Champion[]> {
  console.log("DEBUG (data-fetching): Fetching all champions.");
  const redis = await getConnectedRedisClient();
  const [adcsString, supportsString] = await Promise.all([
    redis.get("champions:adc"),
    redis.get("champions:support"),
  ]);
  const adcs = adcsString ? JSON.parse(adcsString) : [];
  const supports = supportsString ? JSON.parse(supportsString) : [];
  return [...adcs, ...supports];
}

/**
 * Fetches the synergy matrix from Redis.
 * @returns {Promise<SynergyMatrix>} A promise that resolves to the synergy matrix.
 */
export async function getSynergyMatrix(): Promise<SynergyMatrix> {
  const redis = await getConnectedRedisClient();
  const matrixString = await redis.get("matrix:synergy");
  return matrixString ? JSON.parse(matrixString) : {};
}

/**
 * Fetches the counter matrix from Redis.
 * @returns {Promise<CounterMatrix>} A promise that resolves to the counter matrix.
 */
export async function getCounterMatrix(): Promise<CounterMatrix> {
  const redis = await getConnectedRedisClient();
  const matrixString = await redis.get("matrix:counter");
  return matrixString ? JSON.parse(matrixString) : {};
}

/**
 * Fetches a single champion by its ID from Redis.
 * @param {string} id The ID of the champion to fetch.
 * @returns {Promise<Champion | null>} A promise that resolves to the champion object or null if not found.
 */
export async function getChampionById(id: string): Promise<Champion | null> {
  console.log(`DEBUG (data-fetching): Fetching champion with id: ${id}`);
  const redis = await getConnectedRedisClient();
  const championString = await redis.get(`champion:${id}`);
  return championString ? JSON.parse(championString) : null;
}

/**
 * Fetches champions from Redis by role.
 * @param {'adc' | 'support'} role The role to fetch champions for.
 * @returns {Promise<Champion[]>} A promise that resolves to an array of champions.
 */
export async function getChampionsByRole(
  role: "adc" | "support"
): Promise<Champion[]> {
  console.log(`DEBUG (data-fetching): Fetching champions for role: ${role}`);
  const redis = await getConnectedRedisClient();
  const championsString = await redis.get(`champions:${role}`);
  return championsString ? JSON.parse(championsString) : [];
}

/**
 * Fetches all team compositions from Redis.
 * @returns {Promise<TeamComposition[]>} A promise that resolves to an array of team compositions.
 */
export async function getTeamComps(): Promise<TeamComposition[]> {
  console.log("DEBUG (data-fetching): Fetching team compositions.");
  const redis = await getConnectedRedisClient();
  const compsString = await redis.get("teamcomps");
  return compsString ? JSON.parse(compsString) : [];
}

/**
 * Fetches and processes all synergy data from Redis, grouping by ADC and Support.
 * @returns {Promise<{synergiesByAdc: Record<string, Synergy[]>, synergiesBySupport: Record<string, Synergy[]>}>}
 */
export async function getSynergies(): Promise<{
  synergiesByAdc: Record<string, Synergy[]>;
  synergiesBySupport: Record<string, Synergy[]>;
}> {
  console.log("DEBUG (data-fetching): Fetching synergies.");
  const redis = await getConnectedRedisClient();
  const synergiesString = await redis.get("synergies");
  const synergyData: Synergy[] = synergiesString
    ? JSON.parse(synergiesString)
    : [];

  if (!Array.isArray(synergyData)) {
    console.error(
      "DEBUG (data-fetching): Fetched synergy data is not an array!"
    );
    return { synergiesByAdc: {}, synergiesBySupport: {} };
  }

  const synergiesByAdc: Record<string, Synergy[]> = {};
  const synergiesBySupport: Record<string, Synergy[]> = {};

  for (const synergy of synergyData) {
    if (!synergiesByAdc[synergy.adc]) {
      synergiesByAdc[synergy.adc] = [];
    }
    synergiesByAdc[synergy.adc].push(synergy);

    if (!synergiesBySupport[synergy.support]) {
      synergiesBySupport[synergy.support] = [];
    }
    synergiesBySupport[synergy.support].push(synergy);
  }

  const ratingOrder = { Excellent: 0, Good: 1, Neutral: 2, Poor: 3 };

  for (const adc of Object.keys(synergiesByAdc)) {
    synergiesByAdc[adc].sort(
      (a, b) => ratingOrder[a.rating] - ratingOrder[b.rating]
    );
  }

  for (const support of Object.keys(synergiesBySupport)) {
    synergiesBySupport[support].sort(
      (a, b) => ratingOrder[a.rating] - ratingOrder[b.rating]
    );
  }

  return { synergiesByAdc, synergiesBySupport };
}
