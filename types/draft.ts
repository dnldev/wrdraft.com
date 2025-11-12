import { BreakdownItem } from "@/lib/calculator";
import { Archetype } from "@/lib/utils";

/**
 * @file Defines the data structure for a saved draft record.
 */

export type MatchOutcome = "win" | "loss" | "remake";
export type LaneOutcome = "win" | "loss" | "even" | "unplayed";

export interface KDA {
  k: number;
  d: number;
  a: number;
}

/**
 * Represents the champion selections for a single draft.
 */
export interface Selections {
  readonly alliedAdc: string | null;
  readonly alliedSupport: string | null;
  readonly enemyAdc: string | null;
  readonly enemySupport: string | null;
}

/**
 * Represents a complete draft record, including bans, picks, the calculated result,
 * and user-provided notes. This object is what gets sent to the API for persistence.
 */
export interface SavedDraft {
  readonly id: string;
  readonly timestamp: number;
  readonly patch: string;
  readonly bans: {
    readonly your: readonly string[];
    readonly enemy: readonly string[];
  };
  readonly picks: Selections;
  readonly result: {
    readonly overallScore: number;
    readonly winChance: number;
    readonly breakdown: readonly BreakdownItem[];
  };
  readonly archetypes: {
    readonly your: Archetype;
    readonly enemy: Archetype;
  };
  readonly notes?: string;
  readonly matchOutcome: MatchOutcome;
  readonly laneOutcome?: LaneOutcome;
  readonly gameLength?: number; // in minutes
  readonly kda?: {
    adc: KDA;
    support: KDA;
  };
  readonly matchupFeel: number; // 1-5 rating
}
