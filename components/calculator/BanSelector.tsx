"use client";

import { Avatar, Chip, Select, SelectItem } from "@heroui/react";
import React, { Key, useMemo } from "react";

import { Champion } from "@/data/championData";

import { LucideIcon } from "../core/LucideIcon";

interface BanSelectorProps {
  readonly label: string;
  readonly champions: Champion[];
  readonly selectedKeys: Set<string>;
  readonly onSelectionChange: (keys: Iterable<Key>) => void;
}

/**
 * A multi-select component for selecting banned champions, built with HeroUI's Select.
 */
export function BanSelector({
  label,
  champions,
  selectedKeys,
  onSelectionChange,
}: BanSelectorProps) {
  const sortedChampions = useMemo(() => {
    return champions.toSorted((a, b) => a.name.localeCompare(b.name));
  }, [champions]);

  return (
    <div className="w-full max-w-xs">
      <Select
        label={label}
        aria-label="Ban selections"
        selectionMode="multiple"
        placeholder="Select banned champions"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        startContent={<LucideIcon name="Ban" size={16} />}
        classNames={{
          trigger: "h-12",
        }}
        popoverProps={{
          classNames: {
            content: "bg-content1",
          },
        }}
        renderValue={(items) => {
          if (items.length === 0) {
            return (
              <span className="text-foreground/60">No champions banned</span>
            );
          }
          return (
            <div className="flex flex-wrap gap-1">
              {items.map((item) => (
                <Chip
                  key={item.key}
                  size="sm"
                  startContent={
                    <Avatar
                      alt={item.data?.name}
                      className="w-4 h-4"
                      src={item.data?.portraitUrl}
                    />
                  }
                  onClose={() => {
                    const newKeys = new Set(selectedKeys);
                    newKeys.delete(item.key as string);
                    onSelectionChange(newKeys);
                  }}
                >
                  {item.data?.name}
                </Chip>
              ))}
            </div>
          );
        }}
        items={sortedChampions}
      >
        {(champion) => (
          <SelectItem
            key={champion.name}
            textValue={champion.name}
            startContent={
              <Avatar
                alt={champion.name}
                className="w-6 h-6"
                src={champion.portraitUrl}
              />
            }
          >
            {champion.name}
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
