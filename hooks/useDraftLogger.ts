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

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

const isKdaEntered = (kda: KDA) => kda.k > 0 || kda.d > 0 || kda.a > 0;

/**
 * A builder function to construct the final SavedDraft object.
 * This isolates the complex object creation logic from the hook's main body.
 * @private
 */
function buildSavedDraft(
  draftSummary: DraftSummary,
  logResultState: LogResultState,
  yourBans: readonly string[],
  enemyBans: readonly string[]
): SavedDraft {
  const hasAnyKda =
    isKdaEntered(logResultState.kdaAdc) ||
    isKdaEntered(logResultState.kdaSupport) ||
    isKdaEntered(logResultState.kdaEnemyAdc) ||
    isKdaEntered(logResultState.kdaEnemySupport);

  const draft: Partial<Mutable<SavedDraft>> = {
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
  };

  if (logResultState.notes) {
    draft.notes = logResultState.notes;
  }
  if (logResultState.laneOutcome !== "unplayed") {
    draft.laneOutcome = logResultState.laneOutcome;
  }
  if (logResultState.gameLength > 0) {
    draft.gameLength = logResultState.gameLength;
  }

  if (hasAnyKda) {
    const kdaData: NonNullable<Mutable<SavedDraft>["kda"]> = {
      adc: logResultState.kdaAdc,
      support: logResultState.kdaSupport,
    };
    if (isKdaEntered(logResultState.kdaEnemyAdc)) {
      kdaData.enemyAdc = logResultState.kdaEnemyAdc;
    }
    if (isKdaEntered(logResultState.kdaEnemySupport)) {
      kdaData.enemySupport = logResultState.kdaEnemySupport;
    }
    draft.kda = kdaData;
  }

  return draft as SavedDraft;
}

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

    const draftToSave = buildSavedDraft(
      draftSummary,
      logResultState,
      yourBans,
      enemyBans
    );

    try {
      await saveDraft(draftToSave);
      logger.debug(
        "useDraftLogger",
        "Draft saved successfully, resetting state."
      );
      setLogResultState(initialResultState);
      setIsModalOpen(false);
      onSaveSuccess?.();
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
