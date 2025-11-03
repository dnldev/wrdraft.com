// in /components/ChampionGrid.tsx
"use client";

import { Champion } from "@/data/championData";
import { Avatar, Tooltip } from "@heroui/react";

interface ChampionGridProps {
  list: Champion[];
  selectedChampionId: string | undefined;
  onSelectChampion: (id: string) => void;
}

export function ChampionGrid({
  list,
  selectedChampionId,
  onSelectChampion,
}: ChampionGridProps) {
  return (
    <div className="p-4 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-4">
      {list.map((champ) => {
        const isSelected = selectedChampionId === champ.id;
        return (
          <Tooltip content={champ.name} key={champ.id} placement="bottom">
            <button onClick={() => onSelectChampion(champ.id)}>
              <Avatar
                src={champ.portraitUrl}
                alt={`${champ.name} portrait`}
                className={`w-16 h-16 transition-all duration-300 transform hover:scale-110 ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "grayscale hover:grayscale-0"
                }`}
              />
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
