// FILE: app/page.tsx
import React from "react";

import { MatchupCalculator } from "@/components/calculator/MatchupCalculator";
import { ChampionView } from "@/components/champions/ChampionView";
import { Navigation } from "@/components/core/Navigation";
import { DraftingInfo } from "@/components/drafting/DraftingInfo";
import { BestPairings } from "@/components/pairings/BestPairings";
import { TeamComps } from "@/components/team-comps/TeamComps";
import {
  getAllChampions,
  getChampionsByRole,
  getCounterMatrix,
  getFirstPicks,
  getSynergies,
  getSynergyMatrix,
  getTeamComps,
  getTierList,
} from "@/lib/data-fetching";

export default async function HomePage() {
  const [
    adcs,
    supports,
    allChampions,
    { synergiesByAdc, synergiesBySupport },
    teamComps,
    synergyMatrix,
    counterMatrix,
    firstPicks,
    tierList,
  ] = await Promise.all([
    getChampionsByRole("adc"),
    getChampionsByRole("support"),
    getAllChampions(),
    getSynergies(),
    getTeamComps(),
    getSynergyMatrix(),
    getCounterMatrix(),
    getFirstPicks(),
    getTierList(),
  ]);

  return (
    <React.Suspense fallback={null}>
      <Navigation
        views={{
          drafting: <DraftingInfo tierList={tierList} />,
          "team-comps": <TeamComps teamComps={teamComps} />,
          pairings: (
            <BestPairings
              synergiesByAdc={synergiesByAdc}
              synergiesBySupport={synergiesBySupport}
            />
          ),
          champions: <ChampionView adcs={adcs} supports={supports} />,
          calculator: (
            <MatchupCalculator
              adcs={adcs}
              supports={supports}
              allChampions={allChampions}
              synergyMatrix={synergyMatrix}
              counterMatrix={counterMatrix}
              firstPicks={firstPicks}
              tierList={tierList}
            />
          ),
        }}
      />
    </React.Suspense>
  );
}
