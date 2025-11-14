// lib/upstash.ts
/**
 * @file Centralized Upstash Redis client configuration.
 * This file uses a singleton pattern that is robust against Next.js's
 * development server hot-reloading. It attaches the client instance to the
 * `globalThis` object to ensure it's only created once.
 */
import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

import { logger } from "./logger";

// Load environment variables from .env files.
dotenv.config({ path: ".env.development.local" });

declare global {
  var _redisClient: Redis | undefined;
}

function createKvClient(): Redis {
  logger.info("Initializing new Upstash Redis client instance...");

  const url = process.env.WR_KV_REST_API_URL;
  const token = process.env.WR_KV_REST_API_TOKEN;

  // DEBUG: Log the URL to verify the connection target
  logger.debug(
    {
      context: "createKvClient",
      url: url ? `${url.slice(0, 35)}...` : "URL NOT FOUND",
    },
    "Attempting to connect to Redis instance"
  );

  if (!url || !token) {
    const errorMessage =
      "Upstash Redis credentials not found. Ensure WR_KV_REST_API_URL and WR_KV_REST_API_TOKEN are set.";
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  const kv = new Redis({
    url,
    token,
  });

  logger.info("Upstash Redis client initialized successfully.");
  return kv;
}

if (process.env.NODE_ENV === "production") {
  globalThis._redisClient = createKvClient();
} else {
  globalThis._redisClient ??= createKvClient();
}

export function getKvClient(): Redis {
  return globalThis._redisClient as Redis;
}
