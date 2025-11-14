"use client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { CURRENT_PATCH } from "@/lib/constants";
import { logger } from "@/lib/development-logger";
import { saveDraft } from "@/lib/draft-api";
import { KDA, LaneOutcome, MatchOutcome, SavedDraft } from "@/types/draft";

import { DraftSummary } from "./useMatchupCalculator";

export interface LogResultState {
  notes: string;
  matchOutcome: MatchOutcome;
  laneOutcome: LaneOutcome;
  gameLength: number;
  kdaAdc: KDA;
  kdaSupport: KDA;
  kdaEnemyAdc: KDA;
  kdaEnemySupport: KDA;
  matchupFeel: number;
}
const initialResultState: LogResultState = {
  notes: "",
  matchOutcome: "win",
  laneOutcome: "unplayed",
  gameLength: 20,
  kdaAdc: { k: 0, d: 0, a: 0, rating: [] },
  kdaSupport: { k: 0, d: 0, a: 0, rating: [] },
  kdaEnemyAdc: { k: 0, d: 0, a: 0, rating: [] },
  kdaEnemySupport: { k: 0, d: 0, a: 0, rating: [] },
  matchupFeel: 3,
};

const isKdaEntered = (kda: KDA) => kda.k > 0 || kda.d > 0 || kda.a > 0;

interface UseDraftLoggerProps {
  readonly draftSummary: DraftSummary | null;
  readonly yourBans: readonly string[];
  readonly enemyBans: readonly string[];
  readonly onSaveSuccess?: () => void;
}
export function useDraftLogger({
  draftSummary,
  yourBans,
  enemyBans,
  onSaveSuccess,
}: UseDraftLoggerProps) {
  const router = useRouter();
  const [logResultState, setLogResultState] =
    useState<LogResultState>(initialResultState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Constructs the SavedDraft object, sends it to the API, and refreshes the UI on success.
   */
  const handleSaveDraft = async () => {
    if (!draftSummary) {
      logger.error(
        "useDraftLogger",
        "handleSave called without a valid draftSummary."
      );
      return;
    }
    setIsSaving(true);
    logger.debug(
      "useDraftLogger",
      "Constructing draft to save...",
      logResultState
    );

    const draftToSave: SavedDraft = {
      id: nanoid(),
      timestamp: Date.now(),
      patch: CURRENT_PATCH,
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
      kda: {
        adc: logResultState.kdaAdc,
        support: logResultState.kdaSupport,
        ...(isKdaEntered(logResultState.kdaEnemyAdc) && {
          enemyAdc: logResultState.kdaEnemyAdc,
        }),
        ...(isKdaEntered(logResultState.kdaEnemySupport) && {
          enemySupport: logResultState.kdaEnemySupport,
        }),
      },
    };

    try {
      await saveDraft(draftToSave);
      logger.debug(
        "useDraftLogger",
        "Draft saved successfully, resetting state."
      );
      setLogResultState(initialResultState);
      setIsModalOpen(false);
      onSaveSuccess?.(); // Call the success callback
      router.refresh();
    } catch (error) {
      logger.error("useDraftLogger", "Failed to save draft:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLogResultModalOpen: isModalOpen,
    isSaving,
    logResultState,
    openLogResultModal: () => setIsModalOpen(true),
    closeLogResultModal: () => setIsModalOpen(false),
    handleLogResultStateChange: <K extends keyof LogResultState>(
      key: K,
      value: LogResultState[K]
    ) => setLogResultState((prev) => ({ ...prev, [key]: value })),
    handleSaveDraft,
  };
}
