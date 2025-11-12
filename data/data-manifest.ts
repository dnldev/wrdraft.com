/**
 * @file This file acts as a central manifest for all static data used in the application.
 * It maps the keys that will be used in Redis to the corresponding data objects.
 * The `scripts/seed.ts` script iterates over this manifest to populate the database.
 * This pattern ensures that all data is loaded from a single, predictable source.
 */

import { categoryData } from "./categoryData";
import { firstPickData } from "./firstPickData";
import { matrixData } from "./matrixData";
import { synergyData } from "./synergyData";
import { teamCompsData } from "./teamCompsData";
import { tierList63c } from "./tierListData"; // Updated import

/**
 * A manifest mapping Redis keys to their corresponding data sources.
 */
export const dataManifest: Record<string, unknown> = {
  "data:categories": categoryData,
  "data:tierlist": tierList63c, // Updated to use 6.3c data
  firstPicks: firstPickData,
  synergies: synergyData,
  teamcomps: teamCompsData,
  "matrix:synergy": matrixData.synergyMatrix,
  "matrix:counter": matrixData.counterMatrix,
};
