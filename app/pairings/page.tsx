import { groupBy, mapValues, sortBy } from "lodash-es";
import React from "react";

import { MemoizedBestPairings } from "@/components/views";
import { Synergy } from "@/data/synergyData";
import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash";

const KEY_PREFIX = "WR:";

export default async function PairingsPage() {
  logger.info("PairingsPage: Fetching pairings data...");
  const kv = getKvClient();

  const synergiesData = await kv.get<Synergy[]>(`${KEY_PREFIX}synergies`);
  const synergies = synergiesData || [];

  const ratingOrder: Record<Synergy["rating"], number> = {
    Excellent: 0,
    Good: 1,
    Neutral: 2,
    Poor: 3,
  };
  const sortSynergies = (synergyList: Synergy[]) =>
    sortBy(synergyList, (s) => ratingOrder[s.rating]);

  const synergiesByAdc = mapValues(groupBy(synergies, "adc"), sortSynergies);
  const synergiesBySupport = mapValues(
    groupBy(synergies, "support"),
    sortSynergies
  );

  return (
    <MemoizedBestPairings
      synergiesByAdc={synergiesByAdc}
      synergiesBySupport={synergiesBySupport}
    />
  );
}
