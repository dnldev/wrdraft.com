import { BestPairings } from "@/components/BestPairings";
import { ChampionView } from "@/components/ChampionView";
import { DraftingInfo } from "@/components/DraftingInfo";
import { MatchupCalculator } from "@/components/MatchupCalculator";
import { Navigation } from "@/components/Navigation";
import { TeamComps } from "@/components/TeamComps";
import {
    getChampionsByRole,
    getSynergies,
    getTeamComps,
} from "@/lib/data-fetching";
import React from "react";

export default async function HomePage() {
    const [adcs, supports, { synergiesByAdc, synergiesBySupport }, teamComps] =
        await Promise.all([
            getChampionsByRole("adc"),
            getChampionsByRole("support"),
            getSynergies(),
            getTeamComps(),
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
                    calculator: <MatchupCalculator />,
                }}
            />
        </React.Suspense>
    );
}