import type { Metadata } from "next";
import React from "react";

import { MemoizedDraftingInfo } from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";
import { calculateChampionStats } from "@/lib/stats";

export const metadata: Metadata = {
  title: "Tier List | Wild Rift Dragon Lane Playbook",
  description: "The ultimate tier list for Wild Rift bot lane champions.",
};

export default async function HomePage() {
  const { tierList, draftHistory } = await getPlaybookData();
  const championStats = calculateChampionStats(draftHistory);

  return (
    <MemoizedDraftingInfo tierList={tierList} championStats={championStats} />
  );
}
