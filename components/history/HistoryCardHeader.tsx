// components/history/HistoryCardHeader.tsx
"use client";

import {
  Button,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { SavedDraft } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";

interface HistoryCardHeaderProps {
  draft: SavedDraft;
  onDelete: (id: string) => void;
}

export const HistoryCardHeader: React.FC<HistoryCardHeaderProps> = ({
  draft,
  onDelete,
}) => {
  return (
    <CardHeader className="p-4 bg-content2 flex justify-between items-start gap-2">
      <div>
        <h4 className="font-bold text-lg text-primary">
          #{draft.id.slice(0, 6)}
        </h4>
        <p className="text-xs text-foreground/60">
          {new Date(draft.timestamp).toLocaleString()}
          {draft.gameLength && ` • ${draft.gameLength} min`}
        </p>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            aria-label="Draft options"
          >
            <LucideIcon name="EllipsisVertical" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) => key === "delete" && onDelete(draft.id)}
        >
          <DropdownItem
            key="delete"
            color="danger"
            startContent={<LucideIcon name="Trash2" size={16} />}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </CardHeader>
  );
};
