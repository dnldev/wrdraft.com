"use client";

import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";
import { Avatar, Card } from "@heroui/react";
import React, { useMemo, useState } from "react";

import { Category } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { usePopover } from "@/hooks/usePopover";

import { LucideIcon } from "../core/LucideIcon";
import { SwipeableTabs } from "../core/SwipeableTabs";
import { ChampionSelectorGrid } from "./ChampionSelectorGrid";

interface ChampionSelectorProps {
  champions: Champion[];
  selectedChampionName: string | null;
  onSelect: (name: string | null) => void;
  championMap: Map<string, Champion>;
  label: string;
  categories?: Category[];
  isDisabled?: boolean;
}

export function ChampionSelector({
  champions,
  selectedChampionName,
  onSelect,
  championMap,
  label,
  categories = [],
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

  const [activeCategory, setActiveCategory] = useState("All");

  const selectedChampion = selectedChampionName
    ? championMap.get(selectedChampionName)
    : null;

  const categoryTabs = useMemo(() => {
    return ["All", ...categories.map((c) => c.name)].map((name) => ({
      key: name,
      title: name,
    }));
  }, [categories]);

  const filteredChampions = useMemo(() => {
    if (activeCategory === "All") {
      return champions;
    }
    const categoryData = categories.find((cat) => cat.name === activeCategory);
    if (!categoryData) {
      return champions;
    }

    const championsInCategory = new Set(categoryData.champions);
    return champions.filter((champion) =>
      championsInCategory.has(champion.name)
    );
  }, [champions, activeCategory, categories]);

  const handleSelect = (name: string | null) => {
    onSelect(name);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div>
      <div
        className="w-full p-3 bg-content1 rounded-lg flex items-center justify-between transition-colors hover:bg-default/50"
        aria-disabled={isDisabled}
      >
        <button
          type="button"
          ref={refs.setReference}
          {...getReferenceProps()}
          disabled={isDisabled}
          className="flex items-center gap-3 flex-grow min-w-0 disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
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
              <span className="text-foreground/60">{label}</span>
            </>
          )}
        </button>

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
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isDisabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LucideIcon
              name={isOpen ? "ChevronUp" : "ChevronDown"}
              className="transition-transform text-foreground/70 flex-shrink-0"
            />
          </button>
        )}
      </div>

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              // eslint-disable-next-line react-hooks/refs
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="z-50"
            >
              <Card className="w-[95vw] sm:max-w-[300px] p-0 flex flex-col min-h-64 max-h-[80vh]">
                {categories.length > 0 && (
                  <div className="p-1 border-b border-divider sticky top-0 bg-content1 z-10">
                    <SwipeableTabs
                      aria-label="Champion Categories"
                      size="sm"
                      color="primary"
                      items={categoryTabs}
                      selectedKey={activeCategory}
                      onSelectionChange={(key) =>
                        setActiveCategory(key as string)
                      }
                      classNames={{
                        tabList: "bg-transparent p-0",
                      }}
                    />
                  </div>
                )}
                <div className="overflow-y-auto flex-grow min-h-0">
                  <ChampionSelectorGrid
                    champions={filteredChampions}
                    selectedChampionName={selectedChampionName}
                    onSelect={handleSelect}
                  />
                </div>
              </Card>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
