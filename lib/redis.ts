// in lib/redis.ts
import { createClient } from "redis";

// Create a single client instance, but do not connect it here.
const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis Client Error", err));

export async function getConnectedRedisClient() {
  if (!client.isOpen) {
    console.log("DEBUG (Redis): Client is not open. Connecting...");
    await client.connect();
  }
  return client;
}
