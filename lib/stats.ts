import { KDA, SavedDraft, Selections } from "@/types/draft";

/**
 * Defines the performance statistics for a single champion.
 */
export interface ChampionStats {
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
  averageKda: KDA;
}

/**
 * Defines the historical performance for a specific 2v2 matchup.
 */
export interface MatchupPerformance {
  wins: number;
  losses: number;
  gamesPlayed: number;
  winRate: number;
}

const calculateAverage = (value: number, divisor: number): number => {
  if (divisor === 0) return 0;
  return Number.parseFloat((value / divisor).toFixed(1));
};

/**
 * Calculates champion performance statistics from a list of saved drafts.
 *
 * @param {readonly SavedDraft[]} draftHistory - The user's entire match history.
 * @returns {Map<string, ChampionStats>} A map where the key is the champion name
 * and the value is their calculated performance statistics.
 */
export function calculateChampionStats(
  draftHistory: readonly SavedDraft[]
): Map<string, ChampionStats> {
  const stats = new Map<
    string,
    { wins: number; losses: number; k: number; d: number; a: number }
  >();

  const processPlayer = (
    championName: string | null,
    isWin: boolean,
    kda?: KDA
  ) => {
    if (!championName) return;
    const currentStats = stats.get(championName) ?? {
      wins: 0,
      losses: 0,
      k: 0,
      d: 0,
      a: 0,
    };
    if (isWin) {
      currentStats.wins += 1;
    } else {
      currentStats.losses += 1;
    }
    if (kda) {
      currentStats.k += kda.k;
      currentStats.d += kda.d;
      currentStats.a += kda.a;
    }
    stats.set(championName, currentStats);
  };

  for (const draft of draftHistory) {
    if (draft.matchOutcome === "remake") {
      continue;
    }
    const isWin = draft.matchOutcome === "win";
    processPlayer(draft.picks.alliedAdc, isWin, draft.kda?.adc);
    processPlayer(draft.picks.alliedSupport, isWin, draft.kda?.support);
  }

  const finalStats = new Map<string, ChampionStats>();
  for (const [championName, { wins, losses, k, d, a }] of stats.entries()) {
    const gamesPlayed = wins + losses;
    const winRate =
      gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
    finalStats.set(championName, {
      wins,
      losses,
      gamesPlayed,
      winRate,
      averageKda: {
        k: calculateAverage(k, gamesPlayed),
        d: calculateAverage(d, gamesPlayed),
        a: calculateAverage(a, gamesPlayed),
      },
    });
  }

  return finalStats;
}

/**
 * Calculates the historical win rate for a specific 2v2 matchup.
 *
 * @param {Selections} selections - The four champions in the matchup.
 * @param {readonly SavedDraft[]} draftHistory - The user's entire match history.
 * @returns {MatchupPerformance | null} The performance data for this exact matchup, or null if no history exists.
 */
export function calculateMatchupPerformance(
  selections: Selections,
  draftHistory: readonly SavedDraft[]
): MatchupPerformance | null {
  const relevantGames = draftHistory.filter(
    (draft) =>
      draft.matchOutcome !== "remake" &&
      draft.picks.alliedAdc === selections.alliedAdc &&
      draft.picks.alliedSupport === selections.alliedSupport &&
      draft.picks.enemyAdc === selections.enemyAdc &&
      draft.picks.enemySupport === selections.enemySupport
  );

  const gamesPlayed = relevantGames.length;
  if (gamesPlayed === 0) {
    return null;
  }

  const wins = relevantGames.filter((g) => g.matchOutcome === "win").length;
  const losses = gamesPlayed - wins;
  const winRate = Math.round((wins / gamesPlayed) * 100);

  return { wins, losses, gamesPlayed, winRate };
}
