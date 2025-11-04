// in /app/api/champions/route.ts
import { getConnectedRedisClient } from "@/lib/redis"; // <-- FIX: Import the function
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  if (role !== "adc" && role !== "support") {
    return new NextResponse("Invalid role specified", { status: 400 });
  }

  try {
    // FIX: Call the function to get the connected client
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
