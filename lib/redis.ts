// in lib/redis.ts
import { createClient } from "redis";

import { logger } from "./logger";

// Create a single client instance, but do not connect it here.
const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => logger.error(err, "Redis Client Error"));

export async function getConnectedRedisClient() {
  if (!client.isOpen) {
    logger.info("Redis client is not open. Establishing new connection...");
    await client.connect();
    logger.info("Redis client connected successfully.");
  }
  return client;
}
