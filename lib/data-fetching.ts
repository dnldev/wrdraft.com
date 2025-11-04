import { Champion } from "@/data/championData";
import { Synergy } from "@/data/synergyData";
import { TeamComposition } from "@/data/teamCompsData";
import { getConnectedRedisClient } from "@/lib/redis";

/**
 * Fetches champions from Redis by role.
 * @param {'adc' | 'support'} role The role to fetch champions for.
 * @returns {Promise<Champion[]>} A promise that resolves to an array of champions.
 */
export async function getChampionsByRole(
    role: "adc" | "support"
): Promise<Champion[]> {
    console.log(`DEBUG (data-fetching): Fetching champions for role: ${role}`);
    const redis = await getConnectedRedisClient();
    const championsString = await redis.get(`champions:${role}`);
    return championsString ? JSON.parse(championsString) : [];
}

/**
 * Fetches all team compositions from Redis.
 * @returns {Promise<TeamComposition[]>} A promise that resolves to an array of team compositions.
 */
export async function getTeamComps(): Promise<TeamComposition[]> {
    console.log("DEBUG (data-fetching): Fetching team compositions.");
    const redis = await getConnectedRedisClient();
    const compsString = await redis.get("teamcomps");
    return compsString ? JSON.parse(compsString) : [];
}

/**
 * Fetches and processes all synergy data from Redis, grouping by ADC and Support.
 * @returns {Promise<{synergiesByAdc: Record<string, Synergy[]>, synergiesBySupport: Record<string, Synergy[]>}>}
 */
export async function getSynergies(): Promise<{
    synergiesByAdc: Record<string, Synergy[]>;
    synergiesBySupport: Record<string, Synergy[]>;
}> {
    console.log("DEBUG (data-fetching): Fetching synergies.");
    const redis = await getConnectedRedisClient();
    const synergiesString = await redis.get("synergies");
    const synergyData: Synergy[] = synergiesString
        ? JSON.parse(synergiesString)
        : [];

    if (!Array.isArray(synergyData)) {
        console.error(
            "DEBUG (data-fetching): Fetched synergy data is not an array!"
        );
        return { synergiesByAdc: {}, synergiesBySupport: {} };
    }

    const synergiesByAdc = synergyData.reduce((acc, current) => {
        const key = current.adc;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(current);
        return acc;
    }, {} as Record<string, Synergy[]>);

    const synergiesBySupport = synergyData.reduce((acc, current) => {
        const key = current.support;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(current);
        return acc;
    }, {} as Record<string, Synergy[]>);

    const ratingOrder = { Excellent: 0, Good: 1, Neutral: 2, Poor: 3 };

    for (const adc of Object.keys(synergiesByAdc)) {
        synergiesByAdc[adc].sort((a, b) => ratingOrder[a.rating] - ratingOrder[b.rating]);
    }

    for (const support of Object.keys(synergiesBySupport)) {
        synergiesBySupport[support].sort((a, b) => ratingOrder[a.rating] - ratingOrder[b.rating]);
    }

    return { synergiesByAdc, synergiesBySupport };
}