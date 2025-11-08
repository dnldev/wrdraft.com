"use client";

import {
  Avatar,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import React, { useMemo, useState } from "react";

import { Champion } from "@/data/championData";

import { LucideIcon } from "../core/LucideIcon";

interface BanSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  champions: Champion[];
  selectedBans: Set<string>;
  onBanSelect: (championName: string) => void;
}

/**
 * A modal dialog that presents a searchable grid of champions for banning.
 * It disables already banned champions and communicates the selection back
 * to the parent component via the onBanSelect callback.
 */
export function BanSelectorModal({
  isOpen,
  onClose,
  champions,
  selectedBans,
  onBanSelect,
}: BanSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const sortedChampions = useMemo(() => {
    return champions.toSorted((a, b) => a.name.localeCompare(b.name));
  }, [champions]);

  const filteredChampions = useMemo(() => {
    if (!searchQuery) {
      return sortedChampions;
    }
    return sortedChampions.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedChampions, searchQuery]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <Input
            isClearable
            autoFocus
            placeholder="Search champions to ban..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<LucideIcon name="Search" size={16} />}
          />
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 py-4">
            {filteredChampions.map((champion) => {
              const isBanned = selectedBans.has(champion.name);
              return (
                <button
                  key={champion.id}
                  onClick={() => onBanSelect(champion.name)}
                  disabled={isBanned}
                  className="flex flex-col items-center gap-1.5 text-center outline-none disabled:cursor-not-allowed"
                >
                  <Avatar
                    src={champion.portraitUrl}
                    alt={champion.name}
                    className={`w-16 h-16 transition-opacity ${
                      isBanned ? "opacity-30 grayscale" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      isBanned ? "text-danger" : "text-foreground/70"
                    }`}
                  >
                    {champion.name}
                  </span>
                </button>
              );
            })}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
