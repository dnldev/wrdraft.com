"use client";

import { useEffect, useRef, useState } from "react";

import { DraftSummary } from "@/hooks/useMatchupCalculator";

/**
 * Manages the presentation logic for the Draft Summary modal.
 * It uses a timer to show the modal only after selections have been stable for a moment,
 * and tracks whether the summary has been acknowledged by the user to prevent it from
 * reappearing on subsequent re-renders.
 *
 * @param draftSummary The calculated summary object from the useMatchupCalculator hook.
 * @returns An object containing the modal's open state (`isSummaryModalOpen`), a function to close it (`closeSummaryModal`), and a function to reset its acknowledged state (`resetSummaryModal`).
 */
export function useDraftSummaryModal(draftSummary: DraftSummary | null) {
  const [isOpen, setIsOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (draftSummary && !acknowledged) {
      timerRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [draftSummary, acknowledged]);

  const closeSummaryModal = () => {
    setIsOpen(false);
    setAcknowledged(true);
  };

  const resetSummaryModal = () => {
    setAcknowledged(false);
  };

  return { isSummaryModalOpen: isOpen, closeSummaryModal, resetSummaryModal };
}
