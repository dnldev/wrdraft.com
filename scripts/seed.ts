import "dotenv/config";

import dotenv from "dotenv";
import { createClient } from "redis";

import { matchupData } from "@/data/matchupData";
import { synergyData } from "@/data/synergyData";
import { teamCompsData } from "@/data/teamCompsData";

import { Champion, champions as baseChampions } from "../data/championData.js";

dotenv.config({ path: ".env.development.local" });

async function main() {
    if (!process.env.REDIS_URL) {
        throw new Error("Missing Vercel Redis environment variable REDIS_URL.");
    }

    const redis = createClient({ url: process.env.REDIS_URL });
    await redis.connect();
    console.log("Successfully connected to Vercel Redis.");

    await redis.flushAll();
    console.log("Cleared existing Redis data.");

    // MERGE the new matchup data into the base champion data
    const fullChampionsData = baseChampions.map((champ) => {
        const newMatchups = matchupData.find((m) => m.name === champ.name);

        // Create a new champion object with the combined data
        const mergedChampion: Champion = {
            ...champ,
            matchups: {
                ...champ.matchups, // Keep existing synergies
                goodAgainst: newMatchups?.goodAgainst || [], // Add new goodAgainst list
                badAgainst: newMatchups?.badAgainst || [], // Add new badAgainst list
            },
        };
        return mergedChampion;
    });

    const multi = redis.multi();

    for (const champion of fullChampionsData) {
        multi.set(`champion:${champion.id}`, JSON.stringify(champion));
        console.log(`- Staging merged data for champion: ${champion.name}`);
    }

    const adcs = fullChampionsData.filter((c) => c.role.includes("ADC"));
    const supports = fullChampionsData.filter((c) => c.role.includes("Support"));
    multi.set("champions:adc", JSON.stringify(adcs));
    multi.set("champions:support", JSON.stringify(supports));
    console.log("- Staging merged ADC and Support lists...");
    multi.set("synergies", JSON.stringify(synergyData));
    console.log("- Staging all synergy data...");

    // Seed team comps data
    multi.set("teamcomps", JSON.stringify(teamCompsData));
    console.log("- Staging team composition data...");

    await multi.exec();

    redis.destroy();
    console.log("\n✅ Data seeding complete!");
}

main().catch(async (error) => {
    console.error("❌ Error seeding data:", error);
    // Let the process exit with an error code naturally
});
