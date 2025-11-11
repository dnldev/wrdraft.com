import { NextResponse } from "next/server";

import { getConnectedRedisClient } from "@/lib/redis";
import { SavedDraft } from "@/types/draft";

const DRAFTS_KEY = "drafts:history";

/**
 * Handles POST requests to save a completed draft analysis.
 * The draft data is pushed to a Redis list for historical storage.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The response to the client.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let draftData: SavedDraft;

  try {
    draftData = (await request.json()) as SavedDraft;
  } catch {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  // Basic validation for key fields
  const {
    id,
    timestamp,
    patch,
    picks,
    result,
    bans,
    archetypes,
    matchOutcome,
    matchupFeel, // Now required
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
    matchupFeel === undefined || // Check for presence, even if 0
    !picks.alliedAdc ||
    !picks.alliedSupport ||
    !picks.enemyAdc ||
    !picks.enemySupport
  ) {
    return new NextResponse(
      JSON.stringify({ message: "Missing required fields in draft data" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const redis = await getConnectedRedisClient();
    await redis.lPush(DRAFTS_KEY, JSON.stringify(draftData));

    console.log("DEBUG (API): Draft saved successfully", draftData.id);
    return new NextResponse(
      JSON.stringify({
        message: "Draft saved successfully",
        draftId: draftData.id,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Failed to save draft to Redis:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
/**
 * Handles DELETE requests to remove a draft from the history.
 * It finds the specific draft in the Redis list by its ID and removes it.
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} The response to the client.
 */
export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse(JSON.stringify({ message: "Missing draft ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const redis = await getConnectedRedisClient();
    const allDraftsStrings = await redis.lRange(DRAFTS_KEY, 0, -1);

    const draftToRemoveString = allDraftsStrings.find((draftString) => {
      try {
        const draft = JSON.parse(draftString) as SavedDraft;
        return draft.id === id;
      } catch {
        return false;
      }
    });

    if (!draftToRemoveString) {
      return new NextResponse(JSON.stringify({ message: "Draft not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const removedCount = await redis.lRem(DRAFTS_KEY, 1, draftToRemoveString);

    if (removedCount > 0) {
      console.log(`DEBUG (API): Draft deleted successfully: ${id}`);
      return new NextResponse(
        JSON.stringify({ message: "Draft deleted successfully" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Draft not found or already deleted" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to delete draft from Redis:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
