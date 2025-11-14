import type { Metadata } from "next";
import React from "react";

import { MemoizedMatchupCalculator } from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";

export const metadata: Metadata = {
  title: "Matchup Calculator | Wild Rift Dragon Lane Playbook",
  description: "Calculate the best bot lane matchups for Wild Rift.",
};

export default async function CalculatorPage() {
  const {
    adcs,
    supports,
    allChampions,
    synergyMatrix,
    counterMatrix,
    firstPicks,
    tierList,
    categories,
    draftHistory,
  } = await getPlaybookData();

  return (
    <MemoizedMatchupCalculator
      adcs={adcs}
      supports={supports}
      allChampions={allChampions}
      synergyMatrix={synergyMatrix}
      counterMatrix={counterMatrix}
      firstPicks={firstPicks}
      tierList={tierList}
      categories={categories}
      draftHistory={draftHistory}
    />
  );
}
