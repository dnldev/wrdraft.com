import type { Metadata } from "next";
import React from "react";

import { MemoizedDraftHistory } from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Draft History | Wild Rift Dragon Lane Playbook",
  description: "View your saved draft analyses for Wild Rift.",
};

export default async function HistoryPage() {
  const { allChampions, draftHistory } = await getPlaybookData();
  const championMap = new Map(allChampions.map((c) => [c.name, c]));

  return (
    <MemoizedDraftHistory
      draftHistory={draftHistory}
      championMap={championMap}
    />
  );
}
