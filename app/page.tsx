import React from "react";

import { Navigation } from "@/components/core/Navigation";
import {
  MemoizedBestPairings,
  MemoizedChampionView,
  MemoizedDraftHistory,
  MemoizedDraftingInfo,
  MemoizedMatchupCalculator,
  MemoizedTeamComps,
} from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";
import { calculateChampionStats, ChampionStats } from "@/lib/stats";

export default async function HomePage() {
  const {
    adcs,
    supports,
    allChampions,
    synergiesByAdc,
    synergiesBySupport,
    teamComps,
    synergyMatrix,
    counterMatrix,
    firstPicks,
    tierList,
    categories,
    draftHistory,
  } = await getPlaybookData();

  const championStats: Map<string, ChampionStats> =
    calculateChampionStats(draftHistory);

  const calculatorView = (
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

  const championMap = new Map(allChampions.map((c) => [c.name, c]));

  return (
    <React.Suspense fallback={null}>
      <Navigation
        views={{
          drafting: (
            <MemoizedDraftingInfo
              tierList={tierList}
              championStats={championStats}
            />
          ),
          "team-comps": <MemoizedTeamComps teamComps={teamComps} />,
          pairings: (
            <MemoizedBestPairings
              synergiesByAdc={synergiesByAdc}
              synergiesBySupport={synergiesBySupport}
            />
          ),
          champions: (
            <MemoizedChampionView
              adcs={adcs}
              supports={supports}
              championStats={championStats}
            />
          ),
          calculator: calculatorView,
          history: (
            <MemoizedDraftHistory
              draftHistory={draftHistory}
              championMap={championMap}
            />
          ),
        }}
      />
    </React.Suspense>
  );
}
