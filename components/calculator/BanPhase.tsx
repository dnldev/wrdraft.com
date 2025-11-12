"use client";

import { Avatar, Button, Card } from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";

import { LucideIcon } from "../core/LucideIcon";

interface BanSlotProps {
  readonly champion: Champion | null;
  readonly onClick: () => void;
  readonly "aria-label": string;
}

/**
 * Renders a single, clickable slot for a banned champion.
 */
const BanSlot: React.FC<BanSlotProps> = ({ champion, onClick, ...props }) => (
  <button
    onClick={onClick}
    className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-content1 border-2 border-transparent hover:border-primary transition-all flex items-center justify-center relative group"
    aria-label={props["aria-label"]}
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
  readonly championMap: Map<string, Champion>;
  readonly yourBans: readonly string[];
  readonly enemyBans: readonly string[];
  readonly onSlotClick: (team: "your" | "enemy", index: number) => void;
  readonly onLockIn: () => void;
}

/**
 * Renders the UI for the ban selection phase.
 */
export const BanPhase: React.FC<BanPhaseProps> = ({
  championMap,
  yourBans,
  enemyBans,
  onSlotClick,
  onLockIn,
}) => {
  const banSlotList = ["one", "two", "three", "four", "five"];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-success text-center tracking-wider">
          YOUR TEAM&apos;S BANS
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          {banSlotList.map((slot, index) => {
            const champion =
              (yourBans[index] && championMap.get(yourBans[index])) || null;
            return (
              <BanSlot
                key={`your-ban-${slot}`}
                champion={champion}
                onClick={() => onSlotClick("your", index)}
                aria-label={
                  champion
                    ? `Change your team's ban: ${champion.name}`
                    : `Select champion for your team's ban slot ${index + 1}`
                }
              />
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-danger text-center tracking-wider">
          ENEMY TEAM&apos;S BANS
        </p>
        <div className="flex justify-center gap-2 sm:gap-4">
          {banSlotList.map((slot, index) => {
            const champion =
              (enemyBans[index] && championMap.get(enemyBans[index])) || null;
            return (
              <BanSlot
                key={`enemy-ban-${slot}`}
                champion={champion}
                onClick={() => onSlotClick("enemy", index)}
                aria-label={
                  champion
                    ? `Change enemy team's ban: ${champion.name}`
                    : `Select champion for enemy team's ban slot ${index + 1}`
                }
              />
            );
          })}
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
  readonly bannedChampions: Set<string>;
  readonly championMap: Map<string, Champion>;
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
