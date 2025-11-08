"use client";
import { useMemo, useState } from "react";

/**
 Manages the state and logic for the champion banning phase of the draft.
 This includes tracking bans for both teams, locking in the bans,
 and providing a memoized set of all banned champions.
 */
export function useBanPhase() {
  const [enemyBans, setEnemyBans] = useState<string[]>(
    Array.from({ length: 5 }).fill("") as string[]
  );
  const [yourBans, setYourBans] = useState<string[]>([
    "Blitzcrank",
    "Nautilus",
    "",
    "",
    "",
  ]);
  const [bansLocked, setBansLocked] = useState(false);
  /**
   A memoized Set of all unique champion names that have been banned by either team.
   */
  const bannedChampions = useMemo(() => {
    return new Set([...yourBans, ...enemyBans].filter(Boolean));
  }, [yourBans, enemyBans]);
  /**
   Handles the selection or deselection of a banned champion for a specific slot.
   If the champion is already banned elsewhere, it clears the old slot.
   If the clicked slot already contains the selected champion, it clears that slot.
   @param {string} championName - The name of the champion being banned/unbanned.
   @param {"your" | "enemy"} team - The team making the ban.
   @param {number} index - The index of the ban slot (0-4).
   */
  const handleBanSelection = (
    championName: string,
    team: "your" | "enemy",
    index: number
  ) => {
    const setBans = team === "your" ? setYourBans : setEnemyBans;
    setBans((currentBans) => {
      const newBans = [...currentBans];
      const existingIndex = newBans.indexOf(championName);

      // If the champion is already in a different slot, clear that old slot.
      if (existingIndex !== -1 && existingIndex !== index) {
        newBans[existingIndex] = "";
      }

      // Toggle the champion in the newly clicked slot.
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
