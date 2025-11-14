import type { Metadata } from "next";
import React from "react";

import { MemoizedChampionView } from "@/components/views";
import { Champion } from "@/data/championData";
import { logger } from "@/lib/logger";
import { calculateChampionStats } from "@/lib/stats";
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

const KEY_PREFIX = "WR:";
const DRAFTS_KEY = `${KEY_PREFIX}drafts:history`;
const DRAFT_PREFIX = "WR:draft:";

export async function generateStaticParams() {
  return [{ role: "adc" }, { role: "support" }];
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const roleTitle = role === "adc" ? "ADC" : "Support";
  return {
    title: `${roleTitle} Champions | Wild Rift Dragon Lane Playbook`,
    description: `Explore ${roleTitle} champions and their builds for Wild Rift.`,
  };
}

interface ChampionsRolePageProps {
  readonly params: Promise<{
    readonly role: string;
  }>;
}

export default async function ChampionsRolePage({
  params,
}: ChampionsRolePageProps) {
  const { role } = await params;
  logger.info({ role }, "ChampionsRolePage: Fetching champions data...");

  const kv = getKvClient();

  const [adcs, supports, draftIds] = await Promise.all([
    kv.get<Champion[]>(`${KEY_PREFIX}champions:adc`),
    kv.get<Champion[]>(`${KEY_PREFIX}champions:support`),
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

  const championStats = calculateChampionStats(draftHistory);

  return (
    <MemoizedChampionView
      adcs={adcs || []}
      supports={supports || []}
      championStats={championStats}
    />
  );
}
