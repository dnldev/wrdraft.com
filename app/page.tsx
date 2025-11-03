// in app/page.tsx
"use client";

import { BestPairings } from "@/components/BestPairings";
import { ChampionView } from "@/components/ChampionView";
import { DraftingInfo } from "@/components/DraftingInfo";
import { MatchupCalculator } from "@/components/MatchupCalculator";
import { MainView, Navigation } from "@/components/Navigation";
import { TeamComps } from "@/components/TeamComps";
import { useQueryState } from "@/hooks/useQueryState";

export default function HomePage() {
  const [activeView, setActiveView] = useQueryState<MainView>(
    "view",
    "drafting"
  );

  const renderView = () => {
    switch (activeView) {
      case "drafting":
        return <DraftingInfo />;
      case "team-comps":
        return <TeamComps />;
      case "pairings":
        return <BestPairings />;
      case "champions":
        return <ChampionView />;
      case "calculator":
        return <MatchupCalculator />;
      default:
        return <DraftingInfo />;
    }
  };

  return (
    <>
      <Navigation activeView={activeView} setActiveView={setActiveView} />

      <main className="max-w-7xl mx-auto p-4 md:p-6">{renderView()}</main>

      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>Wild Rift Dragon Lane Playbook</p>
      </footer>
    </>
  );
}
