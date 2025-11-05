import { NextResponse } from "next/server";

import { getConnectedRedisClient } from "@/lib/redis";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  if (role !== "adc" && role !== "support") {
    return new NextResponse("Invalid role specified", { status: 400 });
  }

  try {
    const redis = await getConnectedRedisClient();
    const championsString = await redis.get(`champions:${role}`);

    if (!championsString) {
      return new NextResponse("No champions found for this role", {
        status: 404,
      });
    }

    return new NextResponse(championsString, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch from Redis:", error);
    return new NextResponse("Failed to fetch champions from Redis", {
      status: 500,
    });
  }
}
