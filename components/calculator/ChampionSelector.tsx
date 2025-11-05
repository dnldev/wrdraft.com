"use client";

import { FloatingFocusManager } from "@floating-ui/react";
import { Avatar, Card } from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";
import { usePopover } from "@/hooks/usePopover";

import { LucideIcon } from "../core/LucideIcon";
import { ChampionSelectorGrid } from "./ChampionSelectorGrid";

interface ChampionSelectorProps {
  champions: Champion[];
  selectedChampionName: string | null;
  onSelect: (name: string | null) => void;
  championMap: Map<string, Champion>;
  label: string;
  isDisabled?: boolean;
}

export function ChampionSelector({
  champions,
  selectedChampionName,
  onSelect,
  championMap,
  label,
  isDisabled = false,
}: ChampionSelectorProps) {
  const {
    isOpen,
    setIsOpen,
    refs,
    floatingStyles,
    context,
    getFloatingProps,
    getReferenceProps,
  } = usePopover();

  const selectedChampion = selectedChampionName
    ? championMap.get(selectedChampionName)
    : null;

  const handleSelect = (name: string | null) => {
    onSelect(name);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main button from toggling the popover
    onSelect(null);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-foreground/80 mb-2">{label}</p>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        aria-disabled={isDisabled}
        className="w-full p-3 bg-content1 rounded-lg flex items-center justify-between transition-colors hover:bg-default/50 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed text-left"
      >
        <div className="flex items-center gap-3 flex-grow min-w-0">
          {selectedChampion ? (
            <>
              <Avatar
                src={selectedChampion.portraitUrl}
                alt={selectedChampion.name}
                size="md"
              />
              <span className="font-bold text-white truncate">
                {selectedChampion.name}
              </span>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <LucideIcon
                  name="CircleQuestionMark"
                  size={20}
                  className="text-foreground/30"
                />
              </div>
              <span className="text-foreground/60">Select Champion</span>
            </>
          )}
        </div>

        {selectedChampion && !isDisabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Clear selection"
          >
            <LucideIcon name="X" size={16} className="text-foreground/70" />
          </button>
        ) : (
          <LucideIcon
            name={isOpen ? "ChevronUp" : "ChevronDown"}
            className="transition-transform text-foreground/70 flex-shrink-0"
          />
        )}
      </div>

      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            // eslint-disable-next-line
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50"
          >
            <Card className="w-[340px] max-h-80 overflow-y-auto p-0">
              <ChampionSelectorGrid
                champions={champions}
                selectedChampionName={selectedChampionName}
                onSelect={handleSelect}
              />
            </Card>
          </div>
        </FloatingFocusManager>
      )}
    </div>
  );
}
