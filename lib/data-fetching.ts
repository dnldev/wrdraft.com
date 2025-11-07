import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { dataManifest } from "@/data/data-manifest";
import { FirstPickData } from "@/data/firstPickData";
import { Synergy } from "@/data/synergyData";
import { TeamComposition } from "@/data/teamCompsData";
import { TierListData } from "@/data/tierListData";
import { getConnectedRedisClient } from "@/lib/redis";

export type SynergyMatrix = Record<string, Record<string, number>>;
export type CounterMatrix = Record<string, Record<string, number>>;

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

function parseRedisMGet(
  keys: string[],
  results: (string | null)[]
): Record<string, unknown> {
  const parsedData: Record<string, unknown> = {};
  for (const [i, key] of keys.entries()) {
    parsedData[key] = results[i] ? JSON.parse(results[i]) : null;
  }
  return parsedData;
}

function processSynergies(synergyData: Synergy[] | null): {
  synergiesByAdc: Record<string, Synergy[]>;
  synergiesBySupport: Record<string, Synergy[]>;
} {
  const synergiesByAdc: Record<string, Synergy[]> = {};
  const synergiesBySupport: Record<string, Synergy[]> = {};
  if (!synergyData) return { synergiesByAdc, synergiesBySupport };

  const ratingOrder = { Excellent: 0, Good: 1, Neutral: 2, Poor: 3 };

  for (const synergy of synergyData) {
    if (!synergiesByAdc[synergy.adc]) synergiesByAdc[synergy.adc] = [];
    synergiesByAdc[synergy.adc].push(synergy);

    if (!synergiesBySupport[synergy.support])
      synergiesBySupport[synergy.support] = [];
    synergiesBySupport[synergy.support].push(synergy);
  }

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

export async function getPlaybookData(): Promise<PlaybookData> {
  const redis = await getConnectedRedisClient();

  const manifestKeys = Object.keys(dataManifest);
  const allKeys = [...manifestKeys, "champions:adc", "champions:support"];

  const results = await redis.mGet(allKeys);
  const parsedData = parseRedisMGet(allKeys, results);

  const { synergiesByAdc, synergiesBySupport } = processSynergies(
    parsedData.synergies as Synergy[] | null
  );

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
  };
}
