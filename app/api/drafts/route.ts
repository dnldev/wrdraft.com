import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

const DRAFTS_KEY = "WR:drafts:history";

/**
 * Handles POST requests to save a completed draft analysis.
 * The draft data is pushed to a Redis list for historical storage.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The response to the client.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const kv = getKvClient();
  let draftData: SavedDraft;

  try {
    draftData = (await request.json()) as SavedDraft;
    logger.info({ draftId: draftData.id }, "Received request to save draft.");
  } catch (error) {
    logger.error(error, "Failed to parse request body as JSON.");
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const {
    id,
    timestamp,
    patch,
    picks,
    result,
    bans,
    archetypes,
    matchOutcome,
    matchupFeel,
  } = draftData;

  if (
    !id ||
    !timestamp ||
    !patch ||
    !picks ||
    !result ||
    !bans ||
    !archetypes ||
    !matchOutcome ||
    matchupFeel === undefined ||
    !picks.alliedAdc ||
    !picks.alliedSupport ||
    !picks.enemyAdc ||
    !picks.enemySupport
  ) {
    logger.warn({ draftId: id }, "Save draft request failed validation.");
    return new NextResponse(
      JSON.stringify({ message: "Missing required fields in draft data" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    await kv.lpush(DRAFTS_KEY, JSON.stringify(draftData));
    logger.info({ draftId: id }, "Draft saved successfully to Upstash.");
    return new NextResponse(
      JSON.stringify({
        message: "Draft saved successfully",
        draftId: id,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error({ draftId: id, error }, "Failed to save draft to Upstash.");
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Handles DELETE requests to remove a draft from the history.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The response to the client.
 */
export async function DELETE(request: Request): Promise<NextResponse> {
  const kv = getKvClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    logger.warn("DELETE request received without a draft ID.");
    return new NextResponse(JSON.stringify({ message: "Missing draft ID" }), {
      status: 400,
    });
  }

  logger.info({ draftId: id }, "Received request to delete draft.");

  try {
    const allDraftItems = await kv.lrange<SavedDraft | string>(
      DRAFTS_KEY,
      0,
      -1
    );
    let draftToRemove: SavedDraft | null = null;
    let originalItem: SavedDraft | string | null = null;

    for (const item of allDraftItems) {
      try {
        const draft =
          typeof item === "string" ? (JSON.parse(item) as SavedDraft) : item;
        if (draft.id === id) {
          draftToRemove = draft;
          originalItem = item;
          break;
        }
      } catch (error) {
        logger.error(
          { error, corruptedItem: item },
          "Failed to parse a draft item from Redis during deletion scan."
        );
      }
    }

    if (!draftToRemove || !originalItem) {
      logger.warn(
        { draftId: id },
        "Attempted to delete a draft that was not found."
      );
      return new NextResponse(JSON.stringify({ message: "Draft not found" }), {
        status: 404,
      });
    }

    // `lrem` needs the exact original value (string or object) to find and remove it.
    await kv.lrem(DRAFTS_KEY, 1, originalItem);
    logger.info({ draftId: id }, "Draft deleted successfully from Upstash.");
    return new NextResponse(
      JSON.stringify({ message: "Draft deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      { draftId: id, error },
      "Failed to delete draft from Upstash."
    );
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
