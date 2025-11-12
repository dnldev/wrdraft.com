import { NextResponse } from "next/server";

import { Champion } from "@/data/championData";
import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  logger.info({ role }, "API route /api/champions called.");

  if (role !== "adc" && role !== "support") {
    logger.warn({ role }, "Invalid role specified in request.");
    return new NextResponse("Invalid role specified", { status: 400 });
  }

  try {
    const kv = getKvClient();
    const champions = await kv.get<Champion[]>(`WR:champions:${role}`);

    if (!champions) {
      logger.warn({ role }, "No champions found for this role in Redis.");
      return new NextResponse("No champions found for this role", {
        status: 404,
      });
    }

    logger.info({ role }, "Successfully fetched champions for role.");
    return NextResponse.json(champions);
  } catch (error) {
    logger.error(error, "Failed to fetch champions from Upstash.");
    return new NextResponse("Failed to fetch champions from Upstash", {
      status: 500,
    });
  }
}
