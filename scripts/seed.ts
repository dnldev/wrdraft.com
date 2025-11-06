import "dotenv/config";

import dotenv from "dotenv";
import { createClient } from "redis";

import { categoryData } from "@/data/categoryData.js";
import { Champion, champions as baseChampions } from "@/data/championData.js";
import { firstPickData } from "@/data/firstPickData.js";
import { matchupData } from "@/data/matchupData.js";
import { matrixData } from "@/data/matrixData.js";
import { synergyData } from "@/data/synergyData.js";
import { teamCompsData } from "@/data/teamCompsData.js";
import { tierListData } from "@/data/tierListData.js";

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

  const fullChampionsData = baseChampions.map((champ) => {
    const newMatchups = matchupData.find((m) => m.name === champ.name);

    const mergedChampion: Champion = {
      ...champ,
      matchups: {
        ...champ.matchups,
        goodAgainst: newMatchups?.goodAgainst || champ.matchups.goodAgainst,
        badAgainst: newMatchups?.badAgainst || champ.matchups.badAgainst,
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

  multi.set("teamcomps", JSON.stringify(teamCompsData));
  console.log("- Staging team composition data...");

  multi.set("matrix:synergy", JSON.stringify(matrixData.synergyMatrix));
  multi.set("matrix:counter", JSON.stringify(matrixData.counterMatrix));
  console.log("- Staging calculator matrix data...");

  multi.set("firstPicks", JSON.stringify(firstPickData));
  console.log("- Staging first pick data...");

  multi.set("data:tierlist", JSON.stringify(tierListData));
  console.log("- Staging tier list data...");

  multi.set("data:categories", JSON.stringify(categoryData));
  console.log("- Staging champion category data...");

  await multi.exec();

  redis.destroy();
  console.log("\n✅ Data seeding complete!");
}

main().catch(async (error) => {
  console.error("❌ Error seeding data:", error);
});
