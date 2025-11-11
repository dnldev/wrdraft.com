import { groupBy, mapValues, sortBy } from "lodash-es";

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

export async function getPlaybookData(): Promise<PlaybookData> {
  const kv = getKvClient();
  const fetchId = nanoid(6);
  logger.info({ fetchId }, "getPlaybookData: Starting data fetch...");

  const manifestKeys = Object.keys(dataManifest);
  const baseDataKeys = [...manifestKeys, "champions:adc", "champions:support"];
  const prefixedDataKeys = baseDataKeys.map((key) => `${KEY_PREFIX}${key}`);

  const [mGetResults, draftHistoryStrings] = await Promise.all([
    kv.mget<unknown[]>(...prefixedDataKeys),
    kv.lrange<string>(DRAFTS_KEY, 0, 99),
  ]);

  logger.info(
    { fetchId, draftCount: draftHistoryStrings.length },
    "getPlaybookData: Fetched data from Upstash."
  );

  const parsedData: Record<string, unknown> = {};
  for (const [i, key] of baseDataKeys.entries()) {
    parsedData[key] = mGetResults[i] || null;
  }

  const draftHistory = draftHistoryStrings
    .map((s) => {
      try {
        return JSON.parse(s) as SavedDraft;
      } catch {
        return null;
      }
    })
    .filter((d): d is SavedDraft => d !== null);

  const { synergiesByAdc, synergiesBySupport } = processSynergies(
    parsedData.synergies as Synergy[] | null
  );

  const adcs = (parsedData["champions:adc"] as Champion[]) || [];
  const supports = (parsedData["champions:support"] as Champion[]) || [];

  logger.info({ fetchId }, "getPlaybookData: Data fetch and processing complete.");
  return {
    adcs,
    supports,
    allChampions: [...adcs, ...supports],
    synergiesByAdc,
    synergiesBySupport,
    teamComps: (parsedData.teamcomps as TeamComposition[]) || [],
    synergyMatrix: (parsedData["matrix:synergy"] as SynergyMatrix) || {},
    counterMatrix: (parsedData["matrix:counter"] as CounterMatrix) || {},
    firstPicks:
      (parsedData.firstPicks as FirstPickData) || { adcs: [], supports: [] },
    tierList:
      (parsedData["data:tierlist"] as TierListData) || { adc: {}, support: {} },
    categories: (parsedData["data:categories"] as RoleCategories[]) || [],
    draftHistory,
  };
}