"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tooltip,
} from "@heroui/react";
import React from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { useBanPhase } from "@/hooks/useBanPhase";
import { useMatchupCalculator } from "@/hooks/useMatchupCalculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";

import { LucideIcon } from "../core/LucideIcon";
import { ThemeSwitcher } from "../core/ThemeSwitcher";
import { BanPhase, LockedBansDisplay } from "./BanPhase";
import { BanSelectorModal } from "./BanSelectorModal";
import { CalculatorForm } from "./CalculatorForm";
import { DraftSummaryModal } from "./DraftSummaryModal";
import { FirstPicksDisplay } from "./FirstPicksDisplay";
import { RecommendationResults } from "./RecommendationResults";

interface MatchupCalculatorProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  firstPicks: FirstPickData;
  tierList: TierListData;
  categories: RoleCategories[];
}

/**
 * Orchestrates the entire drafting experience by composing the ban and pick phases.
 * It uses the `useBanPhase` and `useMatchupCalculator` hooks to manage state
 * and passes data down to presentational child components.
 */
export function MatchupCalculator(props: MatchupCalculatorProps) {
  const {
    yourBans,
    enemyBans,
    bansLocked,
    setBansLocked,
    bannedChampions,
    handleBanSelection,
  } = useBanPhase();

  const {
    selections,
    results,
    isCalculating,
    championMap,
    championTierMap,
    handleSelectionChange,
    isSelectionEmpty,
    combinedFirstPicks,
    draftSummary,
  } = useMatchupCalculator({ ...props, bannedChampions });

  const [banModalState, setBanModalState] = React.useState<{
    isOpen: boolean;
    team: "your" | "enemy";
    index: number;
  }>({
    isOpen: false,
    team: "your",
    index: 0,
  });
  const [isSummaryModalOpen, setIsSummaryModalOpen] = React.useState(false);
  const [summaryAcknowledged, setSummaryAcknowledged] = React.useState(false);
  const summaryTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (summaryTimerRef.current) {
      clearTimeout(summaryTimerRef.current);
    }

    if (draftSummary && !summaryAcknowledged) {
      summaryTimerRef.current = setTimeout(() => {
        setIsSummaryModalOpen(true);
      }, 2000);
    }

    return () => {
      if (summaryTimerRef.current) {
        clearTimeout(summaryTimerRef.current);
      }
    };
  }, [draftSummary, summaryAcknowledged]);

  const handleSelectionChangeWithReset: typeof handleSelectionChange = (
    role,
    name
  ) => {
    setSummaryAcknowledged(false);
    handleSelectionChange(role, name);
  };

  const openBanModal = (team: "your" | "enemy", index: number) => {
    setBanModalState({ isOpen: true, team, index });
  };

  const handleModalBanSelect = (championName: string) => {
    handleBanSelection(championName, banModalState.team, banModalState.index);
    setBanModalState({ ...banModalState, isOpen: false });
  };

  return (
    <div className="space-y-8">
      <Card className="p-0">
        <CardHeader className="flex flex-col items-center justify-center gap-3 p-4 md:p-6">
          <LucideIcon name="Calculator" className="text-primary" />
          <h2 className="text-3xl font-bold text-primary text-center">
            Matchup Calculator
          </h2>
          <p className="text-sm text-foreground/70 text-center max-w-2xl">
            {bansLocked
              ? "Select the lane participants to get a recommendation."
              : "Select the bans for both teams."}
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="p-4 md:p-6">
          {bansLocked ? (
            <div className="space-y-8">
              <LockedBansDisplay
                bannedChampions={bannedChampions}
                championMap={championMap}
              />
              <CalculatorForm
                adcs={props.adcs}
                supports={props.supports}
                allChampions={props.allChampions}
                categories={props.categories}
                championMap={championMap}
                selections={selections}
                onSelectionChange={handleSelectionChangeWithReset}
                isCalculating={isCalculating}
              />
            </div>
          ) : (
            <BanPhase
              championMap={championMap}
              yourBans={yourBans}
              enemyBans={enemyBans}
              onSlotClick={openBanModal}
              onLockIn={() => setBansLocked(true)}
            />
          )}
        </CardBody>
      </Card>

      {bansLocked &&
        (isSelectionEmpty ? (
          <FirstPicksDisplay
            firstPicks={combinedFirstPicks}
            championMap={championMap}
            tierMap={championTierMap}
          />
        ) : (
          <RecommendationResults
            results={results || []}
            tierMap={championTierMap}
            selections={selections}
          />
        ))}

      <BanSelectorModal
        isOpen={banModalState.isOpen}
        onClose={() => setBanModalState({ ...banModalState, isOpen: false })}
        champions={props.allChampions.filter(
          (c) =>
            !bannedChampions.has(c.name) ||
            (banModalState.team === "your" &&
              yourBans[banModalState.index] === c.name) ||
            (banModalState.team === "enemy" &&
              enemyBans[banModalState.index] === c.name)
        )}
        selectedBans={bannedChampions}
        onBanSelect={handleModalBanSelect}
      />

      <DraftSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => {
          setIsSummaryModalOpen(false);
          setSummaryAcknowledged(true);
        }}
        summary={draftSummary}
        championMap={championMap}
      />

      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:pl-72 z-40 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <ThemeSwitcher />
        </div>
        {bansLocked && (
          <div className="flex flex-col-reverse sm:flex-row gap-2 pointer-events-auto">
            <Tooltip content="Re-open Ban Phase">
              <Button
                isIconOnly
                color="default"
                size="lg"
                onPress={() => setBansLocked(false)}
              >
                <LucideIcon name="RotateCcw" />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
