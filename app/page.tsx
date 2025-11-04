import React from "react";

import { BestPairings } from "@/components/BestPairings";
import { ChampionView } from "@/components/ChampionView";
import { DraftingInfo } from "@/components/DraftingInfo";
import { MatchupCalculator } from "@/components/MatchupCalculator";
import { Navigation } from "@/components/Navigation";
import { TeamComps } from "@/components/TeamComps";
import {
  getAllChampions,
  getChampionsByRole,
  getCounterMatrix,
  getFirstPicks,
  getSynergies,
  getSynergyMatrix,
  getTeamComps,
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
  ] = await Promise.all([
    getChampionsByRole("adc"),
    getChampionsByRole("support"),
    getAllChampions(),
    getSynergies(),
    getTeamComps(),
    getSynergyMatrix(),
    getCounterMatrix(),
    getFirstPicks(),
  ]);

  return (
    <React.Suspense fallback={null}>
      <Navigation
        views={{
          drafting: <DraftingInfo />,
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
            />
          ),
        }}
      />
    </React.Suspense>
  );
}
