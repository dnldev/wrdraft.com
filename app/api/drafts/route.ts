// app/api/drafts/route.ts
import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash";
import { SavedDraft } from "@/types/draft";

const DRAFTS_KEY = "WR:drafts:history";
const DRAFT_PREFIX = "WR:draft:";

function isDraftDataValid(data: Partial<SavedDraft>): data is SavedDraft {
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
  } = data;

  return Boolean(
    id &&
      timestamp &&
      patch &&
      picks &&
      result &&
      bans &&
      archetypes &&
      matchOutcome &&
      matchupFeel !== undefined &&
      picks.alliedAdc &&
      picks.alliedSupport &&
      picks.enemyAdc &&
      picks.enemySupport
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  const kv = getKvClient();
  let draftData: Partial<SavedDraft>;

  try {
    draftData = (await request.json()) as Partial<SavedDraft>;
    logger.info({ draftId: draftData.id }, "Received request to save draft.");
  } catch (error) {
    logger.error(error, "Failed to parse request body as JSON.");
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  if (!isDraftDataValid(draftData)) {
    logger.warn(
      { draftId: draftData.id },
      "Save draft request failed validation."
    );
    return new NextResponse(
      JSON.stringify({ message: "Missing required fields in draft data" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const pipeline = kv.pipeline();
    // CORRECT: Use SET with stringified JSON for the whole object
    pipeline.set(`${DRAFT_PREFIX}${draftData.id}`, JSON.stringify(draftData));
    pipeline.zadd(DRAFTS_KEY, {
      score: draftData.timestamp,
      member: draftData.id,
    });
    await pipeline.exec();

    logger.info(
      { draftId: draftData.id },
      "Draft saved successfully to Upstash."
    );
    return new NextResponse(
      JSON.stringify({
        message: "Draft saved successfully",
        draftId: draftData.id,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error(
      { draftId: draftData.id, error },
      "Failed to save draft to Upstash."
    );
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const kv = getKvClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing draft ID", { status: 400 });
  }

  try {
    const pipeline = kv.pipeline();
    // CORRECT: Use DEL for a simple key
    pipeline.del(`${DRAFT_PREFIX}${id}`);
    pipeline.zrem(DRAFTS_KEY, id);
    await pipeline.exec();

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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
