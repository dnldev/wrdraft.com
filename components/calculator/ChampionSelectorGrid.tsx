"use client";

import { Tooltip } from "@heroui/react";
import Image from "next/image";
import React, { memo, useMemo } from "react";

import { Champion } from "@/data/championData";

interface ChampionAvatarButtonProps {
  champion: Champion;
  isSelected: boolean;
  hasSelection: boolean;
  isDisabled: boolean;
  onSelect: (name: string) => void;
  priority: boolean;
}

const ChampionAvatarButton = memo(function ChampionAvatarButton({
  champion,
  isSelected,
  hasSelection,
  isDisabled,
  onSelect,
  priority,
}: ChampionAvatarButtonProps) {
  const avatarClasses = [
    "w-12 h-12 transition-all duration-200 transform hover:scale-110",
    isSelected
      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
      : "grayscale",
    !isSelected && hasSelection
      ? "opacity-50 hover:opacity-100"
      : "opacity-100",
  ]
    .join(" ")
    .trim();

  const nameClasses = `text-xs font-medium truncate w-12 ${
    isSelected ? "text-primary" : "text-foreground/70"
  }`;

  return (
    <Tooltip content={champion.name} placement="top">
      <button
        onClick={() => onSelect(champion.name)}
        disabled={isDisabled}
        className="flex flex-col items-center gap-1.5 text-center outline-none"
      >
        <Image
          src={champion.portraitUrl}
          alt={`${champion.name} portrait`}
          width={48}
          height={48}
          priority={priority}
          className={`rounded-full object-cover ${avatarClasses}`}
        />
        <span className={nameClasses}>{champion.name}</span>
      </button>
    </Tooltip>
  );
});

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
    return champions.toSorted((a, b) => a.name.localeCompare(b.name));
  }, [champions]);

  const hasSelection = selectedChampionName !== null;

  return (
    <div
      className={`grid grid-cols-5 gap-2 p-2 ${
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {sortedChampions.map((champ, index) => (
        <ChampionAvatarButton
          key={champ.id}
          champion={champ}
          isSelected={selectedChampionName === champ.name}
          hasSelection={hasSelection}
          isDisabled={isDisabled}
          onSelect={handleSelect}
          priority={index < 10}
        />
      ))}
    </div>
  );
}
