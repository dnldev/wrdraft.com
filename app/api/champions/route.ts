import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { getConnectedRedisClient } from "@/lib/redis";

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
    const redis = await getConnectedRedisClient();
    const championsString = await redis.get(`champions:${role}`);

    if (!championsString) {
      logger.warn({ role }, "No champions found for this role in Redis.");
      return new NextResponse("No champions found for this role", {
        status: 404,
      });
    }

    logger.info({ role }, "Successfully fetched champions for role.");
    return new NextResponse(championsString, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.error(error, "Failed to fetch champions from Redis.");
    return new NextResponse("Failed to fetch champions from Redis", {
      status: 500,
    });
  }
}
