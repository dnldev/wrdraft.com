"use client";

import React, { useEffect, useMemo, useState } from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { useDraftLogger } from "@/hooks/useDraftLogger";
import { DraftSummary } from "@/hooks/useMatchupCalculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { logger } from "@/lib/development-logger";

import { LogPreviousDraft } from "./LogPreviousDraft";
import { LogResultModal } from "./LogResultModal";
import { MatchupCalculator } from "./MatchupCalculator";

interface MatchupCalculatorContainerProps {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly allChampions: Champion[];
  readonly synergyMatrix: SynergyMatrix;
  readonly counterMatrix: CounterMatrix;
  readonly firstPicks: FirstPickData;
  readonly tierList: TierListData;
  readonly categories: RoleCategories[];
}

interface UnloggedDraft {
  summary: DraftSummary;
  bans: {
    your: readonly string[];
    enemy: readonly string[];
  };
}

type ViewMode = "default" | "logPrevious";
const UNLOGGED_DRAFT_KEY = "wrdraft:unloggedDraft";

/**
 * A container component that decides which view to render based on whether an
 * un-logged draft is found in local storage.
 */
export function MatchupCalculatorContainer(
  props: MatchupCalculatorContainerProps
) {
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [unloggedDraft, setUnloggedDraft] = useState<UnloggedDraft | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs once on the client to safely access localStorage and
    // avoid hydration errors. The linter rule is suppressed because this
    // is a valid, intentional use case for a one-time client-side sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    try {
      const savedDraftJson = localStorage.getItem(UNLOGGED_DRAFT_KEY);
      if (savedDraftJson) {
        const savedDraft = JSON.parse(savedDraftJson) as UnloggedDraft;
        setUnloggedDraft(savedDraft);
        setViewMode("logPrevious");
        logger.debug(
          "MatchupCalculatorContainer",
          "Found un-logged draft in localStorage."
        );
      }
    } catch (error) {
      logger.error(
        "MatchupCalculatorContainer",
        "Failed to parse draft from localStorage",
        error
      );
      localStorage.removeItem(UNLOGGED_DRAFT_KEY);
    }
  }, []);

  const championMap = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const champ of props.allChampions) {
      map.set(champ.name, champ);
    }
    return map;
  }, [props.allChampions]);

  const clearUnloggedDraft = () => {
    localStorage.removeItem(UNLOGGED_DRAFT_KEY);
    setUnloggedDraft(null);
    setViewMode("default");
  };

  const {
    isLogResultModalOpen,
    isSaving,
    logResultState,
    openLogResultModal,
    closeLogResultModal,
    handleLogResultStateChange,
    handleSaveDraft,
  } = useDraftLogger({
    draftSummary: unloggedDraft?.summary ?? null,
    yourBans: unloggedDraft?.bans.your ?? [],
    enemyBans: unloggedDraft?.bans.enemy ?? [],
    onSaveSuccess: clearUnloggedDraft,
  });

  if (!isClient) {
    return null;
  }

  if (viewMode === "logPrevious" && unloggedDraft) {
    return (
      <div className="space-y-8">
        <LogPreviousDraft
          draft={unloggedDraft.summary}
          championMap={championMap}
          onLog={openLogResultModal}
          onDismiss={clearUnloggedDraft}
        />
        <LogResultModal
          isOpen={isLogResultModalOpen}
          onClose={closeLogResultModal}
          onSave={handleSaveDraft}
          isSaving={isSaving}
          resultState={logResultState}
          onStateChange={handleLogResultStateChange}
        />
      </div>
    );
  }

  return <MatchupCalculator {...props} />;
}
