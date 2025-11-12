// lib/draft-api.ts
/**
 * @file Client-side utilities for interacting with the drafts API.
 */

import { SavedDraft } from "@/types/draft";

import { logger } from "./development-logger";

/**
 * Saves a draft to the database via a POST request.
 * @param {SavedDraft} draft - The draft object to save.
 * @returns {Promise<{ message: string; draftId: string }>} The success response from the API.
 * @throws {Error} If the API response is not ok.
 */
export async function saveDraft(
  draft: SavedDraft
): Promise<{ message: string; draftId: string }> {
  const response = await fetch("/api/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("draft-api", "API Error Response:", { errorBody });
    throw new Error(
      `Failed to save draft. Server responded with ${response.status}.`
    );
  }

  return (await response.json()) as { message: string; draftId: string };
}
