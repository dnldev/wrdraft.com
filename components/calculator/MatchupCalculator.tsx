"use client";

import React, { useEffect, useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { useBanPhase } from "@/hooks/useBanPhase";
import { useDraftLogger } from "@/hooks/useDraftLogger";
import { useDraftSummaryModal } from "@/hooks/useDraftSummaryModal";
import { useMatchupCalculator } from "@/hooks/useMatchupCalculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { logger } from "@/lib/development-logger";

import { BanSelectorModal } from "./BanSelectorModal";
import { DefaultCalculatorView } from "./DefaultCalculatorView";
import { DraftSummaryModal } from "./DraftSummaryModal";
import { FloatingActions } from "./FloatingActions";
import { LogResultModal } from "./LogResultModal";

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

const UNLOGGED_DRAFT_KEY = "wrdraft:unloggedDraft";

/**
 * Encapsulates the entire UI and logic for a standard drafting session,
 * including ban phase, pick phase, and result logging.
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

  // This effect is responsible for persisting a completed draft to local storage
  // so it can be logged on a future session.
  useEffect(() => {
    if (draftSummary) {
      const unloggedDraft = {
        summary: draftSummary,
        bans: { your: yourBans, enemy: enemyBans },
      };
      try {
        localStorage.setItem(UNLOGGED_DRAFT_KEY, JSON.stringify(unloggedDraft));
        logger.debug(
          "MatchupCalculator",
          "Saved un-logged draft to localStorage."
        );
      } catch (error) {
        logger.error(
          "MatchupCalculator",
          "Failed to save draft to localStorage",
          error
        );
      }
    }
  }, [draftSummary, yourBans, enemyBans]);

  const { isSummaryModalOpen, closeSummaryModal, resetSummaryModal } =
    useDraftSummaryModal(draftSummary);

  const {
    isLogResultModalOpen,
    isSaving,
    logResultState,
    openLogResultModal,
    closeLogResultModal,
    handleLogResultStateChange,
    handleSaveDraft,
  } = useDraftLogger({
    draftSummary,
    yourBans,
    enemyBans,
    onSaveSuccess: () => localStorage.removeItem(UNLOGGED_DRAFT_KEY),
  });

  const [banModalState, setBanModalState] = useState<{
    isOpen: boolean;
    team: "your" | "enemy";
    index: number;
  }>({ isOpen: false, team: "your", index: 0 });

  const handleOpenLogResultModal = () => {
    closeSummaryModal();
    openLogResultModal();
  };

  const handleSelectionChangeWithReset: typeof handleSelectionChange = (
    role,
    name
  ) => {
    resetSummaryModal();
    handleSelectionChange(role, name);
  };

  const openBanModal = (team: "your" | "enemy", index: number) =>
    setBanModalState({ isOpen: true, team, index });

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
      <DefaultCalculatorView
        bansLocked={bansLocked}
        bannedChampions={bannedChampions}
        championMap={championMap}
        yourBans={yourBans}
        enemyBans={enemyBans}
        adcs={adcs}
        supports={supports}
        allChampions={allChampions}
        categories={categories}
        selections={selections}
        isCalculating={isCalculating}
        isSelectionEmpty={isSelectionEmpty}
        combinedFirstPicks={combinedFirstPicks}
        championTierMap={championTierMap}
        results={results}
        onSlotClick={openBanModal}
        onLockIn={() => setBansLocked(true)}
        onSelectionChange={handleSelectionChangeWithReset}
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
        onOpenLogResult={handleOpenLogResultModal}
      />
      <LogResultModal
        isOpen={isLogResultModalOpen}
        onClose={closeLogResultModal}
        onSave={handleSaveDraft}
        isSaving={isSaving}
        resultState={logResultState}
        onStateChange={handleLogResultStateChange}
      />
      <FloatingActions
        bansLocked={bansLocked}
        viewMode="default"
        onResetBans={() => setBansLocked(false)}
      />
    </div>
  );
}
