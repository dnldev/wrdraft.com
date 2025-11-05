// FILE: components/ChampionSelectorGrid.tsx
"use client";

import { Avatar, Tooltip } from "@heroui/react";
import React, { useMemo } from "react";

import { Champion } from "@/data/championData";

interface ChampionSelectorGridProps {
  champions: Champion[];
  selectedChampionName: string | null;
  onSelect: (name: string | null) => void;
  isDisabled?: boolean;
}

export function ChampionSelectorGrid({
  champions,
  selectedChampionName,
  onSelect,
  isDisabled = false,
}: ChampionSelectorGridProps) {
  const handleSelect = (name: string) => {
    if (isDisabled) return;
    onSelect(selectedChampionName === name ? null : name);
  };

  const sortedChampions = useMemo(() => {
    return champions.toSorted((a, b) => {
      const aIsComfort = a.comfort !== null;
      const bIsComfort = b.comfort !== null;
      if (aIsComfort && !bIsComfort) return -1;
      if (!aIsComfort && bIsComfort) return 1;

      return a.name.localeCompare(b.name);
    });
  }, [champions]);

  return (
    <div
      className={`grid grid-cols-5 gap-3 p-1 ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {sortedChampions.map((champ) => {
        const isSelected = selectedChampionName === champ.name;
        return (
          <Tooltip content={champ.name} key={champ.id} placement="top">
            <button
              onClick={() => handleSelect(champ.name)}
              disabled={isDisabled}
              className="flex flex-col items-center gap-1.5 text-center outline-none"
            >
              <Avatar
                src={champ.portraitUrl}
                alt={`${champ.name} portrait`}
                className={`w-14 h-14 transition-all duration-200 transform hover:scale-110 ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "grayscale"
                } ${
                  !isSelected && selectedChampionName
                    ? "opacity-50 hover:opacity-100"
                    : "opacity-100"
                }`}
              />
              <span
                className={`text-xs font-medium truncate w-14 ${
                  isSelected ? "text-primary" : "text-foreground/70"
                }`}
              >
                {champ.name}
              </span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
