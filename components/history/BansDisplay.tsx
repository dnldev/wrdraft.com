// components/history/BansDisplay.tsx
"use client";

import { Champion } from "@/data/championData";
import { SavedDraft } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";

interface BansDisplayProps {
  draft: SavedDraft;
  championMap: Map<string, Champion>;
}

export const BansDisplay: React.FC<BansDisplayProps> = ({
  draft,
  championMap,
}) => {
  const allBans = [...draft.bans.your, ...draft.bans.enemy];
  if (allBans.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm">
      <LucideIcon name="Ban" className="text-danger" size={16} />
      <p className="font-semibold text-foreground/70">Bans:</p>
      {allBans.map((ban) => (
        <span key={ban} className="text-foreground/80">
          {championMap.get(ban)?.name || ban}
        </span>
      ))}
    </div>
  );
};
