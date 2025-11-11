"use client";

import { useMemo, useState } from "react";

const defaultBans = ["Nautilus", "Blitzcrank", "", "", ""];

interface UseBanPhaseOptions {
  readonly initialYourBans?: string[];
  readonly initialEnemyBans?: string[];
}

/**
 * Manages the state and logic for the champion banning phase of the draft.
 * This includes tracking bans for both teams, locking in the bans,
 * and providing a memoized set of all banned champions.
 * @returns An object containing ban state and handlers.
 */
export function useBanPhase(options: UseBanPhaseOptions = {}) {
  const {
    initialYourBans = defaultBans,
    initialEnemyBans = ["", "", "", "", ""],
  } = options;

  const [yourBans, setYourBans] = useState<string[]>(initialYourBans);
  const [enemyBans, setEnemyBans] = useState<string[]>(initialEnemyBans);
  const [bansLocked, setBansLocked] = useState(false);

  const bannedChampions = useMemo(() => {
    return new Set([...yourBans, ...enemyBans].filter(Boolean));
  }, [yourBans, enemyBans]);

  const handleBanSelection = (
    championName: string,
    team: "your" | "enemy",
    index: number
  ) => {
    const setBans = team === "your" ? setYourBans : setEnemyBans;

    setBans((currentBans) => {
      const newBans = [...currentBans];
      const existingIndex = newBans.indexOf(championName);

      if (existingIndex !== -1 && existingIndex !== index) {
        newBans[existingIndex] = "";
      }

      newBans[index] = newBans[index] === championName ? "" : championName;

      return newBans;
    });
  };

  return {
    yourBans,
    enemyBans,
    bansLocked,
    setBansLocked,
    bannedChampions,
    handleBanSelection,
  };
}
