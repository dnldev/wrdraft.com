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

  // The calculator now receives all the data as props and manages its own state internally.
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
    />
  );

  const championMap = new Map(allChampions.map((c) => [c.name, c]));

  return (
    <React.Suspense fallback={null}>
      <Navigation
        views={{
          drafting: <MemoizedDraftingInfo tierList={tierList} />,
          "team-comps": <MemoizedTeamComps teamComps={teamComps} />,
          pairings: (
            <MemoizedBestPairings
              synergiesByAdc={synergiesByAdc}
              synergiesBySupport={synergiesBySupport}
            />
          ),
          champions: <MemoizedChampionView adcs={adcs} supports={supports} />,
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
