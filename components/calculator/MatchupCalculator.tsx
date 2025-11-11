"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tooltip,
} from "@heroui/react";
import { nanoid } from "nanoid";
import React, { useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPick, FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { useBanPhase } from "@/hooks/useBanPhase";
import { useDraftSummaryModal } from "@/hooks/useDraftSummaryModal";
import { useMatchupCalculator } from "@/hooks/useMatchupCalculator";
import { PairRecommendation } from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { saveDraft } from "@/lib/draft-api";
import { SavedDraft } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";
import { ThemeSwitcher } from "../core/ThemeSwitcher";
import { BanPhase, LockedBansDisplay } from "./BanPhase";
import { BanSelectorModal } from "./BanSelectorModal";
import { CalculatorForm } from "./CalculatorForm";
import { DraftSummaryModal } from "./DraftSummaryModal";
import { FirstPicksDisplay } from "./FirstPicksDisplay";
import { LogResultModal, LogResultState } from "./LogResultModal";
import { RecommendationResults } from "./RecommendationResults";

interface CalculatorResultsContentProps {
  readonly bansLocked: boolean;
  readonly isSelectionEmpty: boolean;
  readonly combinedFirstPicks: FirstPick[];
  readonly championMap: Map<string, Champion>;
  readonly championTierMap: Map<string, string>;
  readonly results: PairRecommendation[] | null;
}

/**
 * A sub-component to handle the conditional rendering of the calculator's main content area.
 * It decides whether to show the first picks display or the recommendation results.
 */
const CalculatorResultsContent: React.FC<CalculatorResultsContentProps> = ({
  bansLocked,
  isSelectionEmpty,
  combinedFirstPicks,
  championMap,
  championTierMap,
  results,
}) => {
  if (!bansLocked) {
    return null;
  }

  return isSelectionEmpty ? (
    <FirstPicksDisplay
      firstPicks={combinedFirstPicks}
      championMap={championMap}
      tierMap={championTierMap}
    />
  ) : (
    <RecommendationResults results={results || []} />
  );
};

const initialResultState: LogResultState = {
  notes: "",
  matchOutcome: "win",
  laneOutcome: "unplayed",
  gameLength: 20,
  kdaAdc: { k: 0, d: 0, a: 0 },
  kdaSupport: { k: 0, d: 0, a: 0 },
  matchupFeel: 3,
};

interface MatchupCalculatorProps {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly allChampions: Champion[];
  readonly synergyMatrix: SynergyMatrix;
  readonly counterMatrix: CounterMatrix;
  readonly firstPicks: FirstPickData;
  readonly tierList: TierListData;
  readonly categories: RoleCategories[];
}

/**
 * Orchestrates the entire drafting experience by composing the ban and pick phases,
 * showing matchup analysis, and handling the logic for logging game results.
 */
export function MatchupCalculator(props: MatchupCalculatorProps) {
  const {
    adcs,
    supports,
    allChampions,
    synergyMatrix,
    counterMatrix,
    firstPicks,
    tierList,
    categories,
  } = props;

  const [logResultState, setLogResultState] =
    useState<LogResultState>(initialResultState);
  const [isLogResultModalOpen, setLogResultModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const PATCH_VERSION = "6.3b";

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
  } = useMatchupCalculator({
    adcs,
    supports,
    allChampions,
    synergyMatrix,
    counterMatrix,
    firstPicks,
    tierList,
    categories,
    bannedChampions,
  });

  const { isSummaryModalOpen, closeSummaryModal, resetSummaryModal } =
    useDraftSummaryModal(draftSummary);

  const [banModalState, setBanModalState] = React.useState<{
    isOpen: boolean;
    team: "your" | "enemy";
    index: number;
  }>({
    isOpen: false,
    team: "your",
    index: 0,
  });

  /**
   * Updates a specific field in the log result form state.
   */
  const handleLogResultStateChange = <K extends keyof LogResultState>(
    key: K,
    value: LogResultState[K]
  ) => {
    setLogResultState((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Transitions from the summary view to the result logging view.
   */
  const openLogResultModal = () => {
    closeSummaryModal();
    setLogResultModalOpen(true);
  };

  /**
   * Constructs the final SavedDraft object and sends it to the API.
   */
  const handleSaveDraft = async () => {
    if (!draftSummary) return;
    setIsSaving(true);

    const isKdaAdcEntered =
      logResultState.kdaAdc.k > 0 ||
      logResultState.kdaAdc.d > 0 ||
      logResultState.kdaAdc.a > 0;
    const isKdaSupportEntered =
      logResultState.kdaSupport.k > 0 ||
      logResultState.kdaSupport.d > 0 ||
      logResultState.kdaSupport.a > 0;

    const draftToSave: SavedDraft = {
      id: nanoid(),
      timestamp: Date.now(),
      patch: PATCH_VERSION,
      bans: {
        your: yourBans.filter(Boolean),
        enemy: enemyBans.filter(Boolean),
      },
      picks: draftSummary.selections,
      result: {
        overallScore: draftSummary.overallScore,
        winChance: draftSummary.winChance,
        breakdown: draftSummary.breakdown,
      },
      archetypes: draftSummary.archetypes,
      matchOutcome: logResultState.matchOutcome,
      matchupFeel: logResultState.matchupFeel,
      ...(logResultState.notes && { notes: logResultState.notes }),
      ...(logResultState.laneOutcome !== "unplayed" && {
        laneOutcome: logResultState.laneOutcome,
      }),
      ...(logResultState.gameLength > 0 && {
        gameLength: logResultState.gameLength,
      }),
      ...((isKdaAdcEntered || isKdaSupportEntered) && {
        kda: {
          adc: logResultState.kdaAdc,
          support: logResultState.kdaSupport,
        },
      }),
    };

    try {
      await saveDraft(draftToSave);
      setLogResultState(initialResultState);
      setLogResultModalOpen(false);
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectionChangeWithReset: typeof handleSelectionChange = (
    role,
    name
  ) => {
    resetSummaryModal();
    handleSelectionChange(role, name);
  };

  const openBanModal = (team: "your" | "enemy", index: number) => {
    setBanModalState({ isOpen: true, team, index });
  };

  const handleModalBanSelect = (championName: string) => {
    handleBanSelection(championName, banModalState.team, banModalState.index);
    setBanModalState({ ...banModalState, isOpen: false });
  };

  const availableChampionsForBanModal = useMemo(() => {
    const currentSlotChampionName =
      banModalState.team === "your"
        ? yourBans[banModalState.index]
        : enemyBans[banModalState.index];
    return allChampions.filter(
      (c) => !bannedChampions.has(c.name) || c.name === currentSlotChampionName
    );
  }, [allChampions, bannedChampions, yourBans, enemyBans, banModalState]);

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
                adcs={adcs}
                supports={supports}
                allChampions={allChampions}
                categories={categories}
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
      <CalculatorResultsContent
        bansLocked={bansLocked}
        isSelectionEmpty={isSelectionEmpty}
        combinedFirstPicks={combinedFirstPicks}
        championMap={championMap}
        championTierMap={championTierMap}
        results={results}
      />
      <BanSelectorModal
        isOpen={banModalState.isOpen}
        onClose={() => setBanModalState({ ...banModalState, isOpen: false })}
        champions={availableChampionsForBanModal}
        selectedBans={bannedChampions}
        onBanSelect={handleModalBanSelect}
      />
      <DraftSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={closeSummaryModal}
        summary={draftSummary}
        championMap={championMap}
        onOpenLogResult={openLogResultModal}
      />
      <LogResultModal
        isOpen={isLogResultModalOpen}
        onClose={() => setLogResultModalOpen(false)}
        onSave={handleSaveDraft}
        isSaving={isSaving}
        resultState={logResultState}
        onStateChange={handleLogResultStateChange}
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
