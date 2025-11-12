"use client";

import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { saveDraft } from "@/lib/draft-api";
import { KDA, LaneOutcome, MatchOutcome, SavedDraft } from "@/types/draft";

import { logger } from "../lib/development-logger";
import { DraftSummary } from "./useMatchupCalculator";

/**
 * The shape of the state object for the result logging form.
 */
export interface LogResultState {
  notes: string;
  matchOutcome: MatchOutcome;
  laneOutcome: LaneOutcome;
  gameLength: number;
  kdaAdc: KDA;
  kdaSupport: KDA;
  matchupFeel: number;
}

/**
 * The initial state for the draft logging form.
 */
const initialResultState: LogResultState = {
  notes: "",
  matchOutcome: "win",
  laneOutcome: "unplayed",
  gameLength: 20,
  kdaAdc: { k: 0, d: 0, a: 0 },
  kdaSupport: { k: 0, d: 0, a: 0 },
  matchupFeel: 3,
};

/**
 * The current game patch version.
 */
const PATCH_VERSION = "6.3b";

interface UseDraftLoggerProps {
  readonly draftSummary: DraftSummary | null;
  readonly yourBans: readonly string[];
  readonly enemyBans: readonly string[];
  readonly onSaveSuccess?: () => void;
}

/**
 * Manages the state and logic for the game result logging modal.
 * This includes handling the form state, saving the draft to the API,
 * and refreshing the page data on success.
 * @param {UseDraftLoggerProps} props - The current draft data needed to save the result.
 * @returns An object containing state and handlers for the logging UI.
 */
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
  const handleSave = async () => {
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
    handleSaveDraft: handleSave,
  };
}
