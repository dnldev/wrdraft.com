/**
 * @file Centralized Upstash Redis client configuration.
 * This file uses a singleton pattern to lazily initialize the Redis client.
 * This ensures that the client is only instantiated once and only when first needed,
 * guaranteeing that environment variables have been loaded by Next.js or dotenv.
 */

import { Redis } from "@upstash/redis";

import { logger } from "./logger";

let kv: Redis | null = null;

/**
 * Returns a singleton instance of the Upstash Redis client.
 * @returns {Redis} The singleton Redis client instance.
 */
export function getKvClient(): Redis {
  if (kv) {
    return kv;
  }

  logger.info("Initializing new Upstash Redis client instance...");

  const url = process.env.WR_KV_REST_API_URL;
  const token = process.env.WR_KV_REST_API_TOKEN;

  if (!url || !token) {
    const errorMessage =
      "Upstash Redis credentials not found. Ensure WR_KV_REST_API_URL and WR_KV_REST_API_TOKEN are set.";
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  kv = new Redis({
    url,
    token,
  });

  logger.info("Upstash Redis client initialized successfully.");
  return kv;
}
