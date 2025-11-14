import type { Metadata } from "next";
import React from "react";

import { MemoizedDraftHistory } from "@/components/views";
import { Champion } from "@/data/championData";
import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

const KEY_PREFIX = "WR:";
const DRAFTS_KEY = `${KEY_PREFIX}drafts:history`;
const DRAFT_PREFIX = "WR:draft:";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft History | Wild Rift Dragon Lane Playbook",
  description: "View your saved draft analyses for Wild Rift.",
};

export default async function HistoryPage() {
  logger.info("HistoryPage: Fetching history data...");
  const kv = getKvClient();

  const [draftIds, adcs, supports] = await Promise.all([
    kv.zrange(DRAFTS_KEY, 0, 99, { rev: true }),
    kv.get<Champion[]>(`${KEY_PREFIX}champions:adc`),
    kv.get<Champion[]>(`${KEY_PREFIX}champions:support`),
  ]);

  let draftHistory: SavedDraft[] = [];
  if (draftIds.length > 0) {
    const draftKeys = (draftIds as string[]).map(
      (id) => `${DRAFT_PREFIX}${id}`
    );
    const drafts = await kv.mget<SavedDraft[]>(...draftKeys);
    draftHistory = drafts.filter((d): d is SavedDraft => d !== null);
  }

  const allChampions = [...(adcs || []), ...(supports || [])];
  const championMap = new Map(allChampions.map((c) => [c.name, c]));

  return (
    <MemoizedDraftHistory
      draftHistory={draftHistory}
      championMap={championMap}
    />
  );
}
