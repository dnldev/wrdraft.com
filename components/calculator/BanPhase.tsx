"use client";

import { Avatar, Button, Card } from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";

import { LucideIcon } from "../core/LucideIcon";

interface BanSlotProps {
  champion: Champion | null;
  onClick: () => void;
}

/**
 * Renders a single, clickable slot for a banned champion.
 * It displays a plus icon for an empty slot, or a grayscale champion avatar
 * with a ban icon overlay if a champion is selected.
 */
const BanSlot: React.FC<BanSlotProps> = ({ champion, onClick }) => (
  <button
    onClick={onClick}
    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-content1 border-2 border-transparent hover:border-primary transition-all flex items-center justify-center relative group"
  >
    {champion ? (
      <div className="relative w-full h-full">
        <Avatar
          src={champion.portraitUrl}
          alt={champion.name}
          className="w-full h-full grayscale"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <LucideIcon name="Ban" size={32} className="text-danger" />
        </div>
      </div>
    ) : (
      <LucideIcon
        name="Plus"
        className="text-foreground/20 group-hover:text-primary transition-colors"
      />
    )}
  </button>
);

interface BanPhaseProps {
  championMap: Map<string, Champion>;
  yourBans: string[];
  enemyBans: string[];
  onSlotClick: (team: "your" | "enemy", index: number) => void;
  onLockIn: () => void;
}

/**
 * Renders the UI for the ban selection phase. It displays 10 slots (5 per team)
 * that users can click to open a champion selection modal. It is responsible for
 * displaying the current state of bans and transitioning to the pick phase via
 * the onLockIn callback.
 */
export const BanPhase: React.FC<BanPhaseProps> = ({
  championMap,
  yourBans,
  enemyBans,
  onSlotClick,
  onLockIn,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-success text-center tracking-wider">
          YOUR TEAM&apos;S BANS
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <BanSlot
              key={`your-ban-${index}`}
              champion={
                yourBans[index] ? championMap.get(yourBans[index])! : null
              }
              onClick={() => onSlotClick("your", index)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-danger text-center tracking-wider">
          ENEMY TEAM&apos;S BANS
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <BanSlot
              key={`enemy-ban-${index}`}
              champion={
                enemyBans[index] ? championMap.get(enemyBans[index])! : null
              }
              onClick={() => onSlotClick("enemy", index)}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <Button
          color="primary"
          size="lg"
          onPress={onLockIn}
          className="font-bold"
        >
          Lock In Bans
        </Button>
      </div>
    </div>
  );
};

interface LockedBansDisplayProps {
  bannedChampions: Set<string>;
  championMap: Map<string, Champion>;
}

/**
 * Displays a compact, read-only list of all banned champions after the ban
 * phase is locked in, typically shown at the top of the champion select form.
 */
export const LockedBansDisplay: React.FC<LockedBansDisplayProps> = ({
  bannedChampions,
  championMap,
}) => (
  <Card className="p-2">
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <LucideIcon name="Ban" className="text-danger flex-shrink-0" />
      <p className="text-sm font-semibold text-danger mr-2 flex-shrink-0">
        BANS:
      </p>
      {[...bannedChampions].map((ban) => {
        const champion = championMap.get(ban);
        return champion ? (
          <Avatar
            key={ban}
            src={champion.portraitUrl}
            size="sm"
            isBordered
            color="danger"
          />
        ) : null;
      })}
    </div>
  </Card>
);
