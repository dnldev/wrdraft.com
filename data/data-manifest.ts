/**
 * @file This file acts as a manifest for all static data in the application.
 * It maps the desired Redis key to the imported data object.
 * This is the central point for adding or removing data types.
 */

import { categoryData } from "./categoryData";
import { firstPickData } from "./firstPickData";
import { matrixData } from "./matrixData";
import { synergyData } from "./synergyData";
import { teamCompsData } from "./teamCompsData";
import { tierListData } from "./tierListData";

export const dataManifest = {
  "data:categories": categoryData,
  "data:tierlist": tierListData,
  firstPicks: firstPickData,
  synergies: synergyData,
  teamcomps: teamCompsData,
  "matrix:synergy": matrixData.synergyMatrix,
  "matrix:counter": matrixData.counterMatrix,
};
