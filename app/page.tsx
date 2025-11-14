import type { Metadata } from "next";
import React from "react";

import { MemoizedDraftingInfo } from "@/components/views";
import { TierListData } from "@/data/tierListData";
import { logger } from "@/lib/logger";
import { calculateChampionStats } from "@/lib/stats";
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

const KEY_PREFIX = "WR:";
const DRAFTS_KEY = `${KEY_PREFIX}drafts:history`;
const DRAFT_PREFIX = "WR:draft:";

export const metadata: Metadata = {
  title: "Tier List | Wild Rift Dragon Lane Playbook",
  description: "The ultimate tier list for Wild Rift bot lane champions.",
};

export default async function HomePage() {
  logger.info("HomePage: Fetching tier list data...");
  const kv = getKvClient();

  const [tierListData, draftIds] = await Promise.all([
    kv.get<TierListData>(`${KEY_PREFIX}data:tierlist`),
    kv.zrange(DRAFTS_KEY, 0, 99, { rev: true }),
  ]);

  let draftHistory: SavedDraft[] = [];
  if (draftIds.length > 0) {
    const draftKeys = (draftIds as string[]).map(
      (id) => `${DRAFT_PREFIX}${id}`
    );
    const drafts = await kv.mget<SavedDraft[]>(...draftKeys);
    draftHistory = drafts.filter((d): d is SavedDraft => d !== null);
  }

  const tierList = tierListData || { adc: {}, support: {} };
  const championStats = calculateChampionStats(draftHistory);

  return (
    <MemoizedDraftingInfo tierList={tierList} championStats={championStats} />
  );
}
