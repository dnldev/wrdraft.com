"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React, { useState } from "react";

import { Champion } from "@/data/championData";
import { SavedDraft } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";
import { HistoryCard } from "./HistoryCard";

interface DraftHistoryProps {
  readonly draftHistory: SavedDraft[];
  readonly championMap: Map<string, Champion>;
}

/**
 * Renders the list of saved draft analyses and manages the state for deleting entries.
 * It performs optimistic UI updates for a responsive user experience.
 */
export const DraftHistory: React.FC<DraftHistoryProps> = ({
  draftHistory: initialDraftHistory,
  championMap,
}) => {
  const [drafts, setDrafts] = useState(initialDraftHistory);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /**
   * Handles the deletion of a draft. It optimistically removes the draft
   * from the UI and sends a DELETE request to the API. If the request
   * fails, it reverts the UI to its previous state.
   * @param {string} draftId - The ID of the draft to delete.
   */
  const handleDelete = async (draftId: string) => {
    const originalDrafts = drafts;
    setDeletingId(draftId);

    // Optimistically update UI
    setDrafts((currentDrafts) => currentDrafts.filter((d) => d.id !== draftId));

    try {
      const response = await fetch(`/api/drafts?id=${draftId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete draft:", await response.text());
        setDrafts(originalDrafts); // Revert on failure
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
      setDrafts(originalDrafts); // Revert on network error
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
        <LucideIcon name="History" className="text-primary" />
        <h2 className="text-3xl font-bold text-primary text-center">
          Match History
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 md:p-6">
        {drafts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <HistoryCard
                key={draft.id}
                draft={draft}
                championMap={championMap}
                onDelete={handleDelete}
                isDeleting={deletingId === draft.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70">No saved draft analyses found.</p>
            <p className="text-sm text-foreground/50 mt-2">
              Complete a draft in the Calculator and save it to see it here.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
