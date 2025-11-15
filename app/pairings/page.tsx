import type { Metadata } from "next";
import React from "react";

import { MemoizedBestPairings } from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";

export const metadata: Metadata = {
  title: "Best Pairings | Wild Rift Dragon Lane Playbook",
  description: "Explore the best ADC and Support pairings for Wild Rift.",
};

export default async function PairingsPage() {
  const { synergiesByAdc, synergiesBySupport } = await getPlaybookData();

  return (
    <MemoizedBestPairings
      synergiesByAdc={synergiesByAdc}
      synergiesBySupport={synergiesBySupport}
    />
  );
}
