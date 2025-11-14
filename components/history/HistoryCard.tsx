// components/history/HistoryCard.tsx
import { Card, CardBody, Divider } from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";
import { SavedDraft } from "@/types/draft";

import { BansDisplay } from "./BansDisplay";
import { HistoryCardHeader } from "./HistoryCardHeader";
import { HistoryStats } from "./HistoryStats";
import { TeamDisplay } from "./TeamDisplay";

interface HistoryCardProps {
  readonly draft: SavedDraft;
  readonly championMap: Map<string, Champion>;
  readonly onDelete: (id: string) => void;
  readonly isDeleting: boolean;
}

/**
 * Displays a single saved draft record by composing smaller, single-purpose components.
 */
export const HistoryCard: React.FC<HistoryCardProps> = ({
  draft,
  championMap,
  onDelete,
  isDeleting,
}) => {
  return (
    <Card
      className={`p-0 overflow-hidden transition-opacity ${isDeleting ? "opacity-50" : "opacity-100"}`}
    >
      <HistoryCardHeader draft={draft} onDelete={onDelete} />
      <CardBody className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TeamDisplay
            label="Your Team"
            color="success"
            adcName={draft.picks.alliedAdc}
            supportName={draft.picks.alliedSupport}
            adcKda={draft.kda?.adc}
            supportKda={draft.kda?.support}
            championMap={championMap}
          />
          <TeamDisplay
            label="Enemy Team"
            color="danger"
            adcName={draft.picks.enemyAdc}
            supportName={draft.picks.enemySupport}
            adcKda={draft.kda?.enemyAdc}
            supportKda={draft.kda?.enemySupport}
            championMap={championMap}
          />
        </div>

        <Divider />
        <HistoryStats draft={draft} />
        <Divider />

        <BansDisplay draft={draft} championMap={championMap} />

        {draft.notes && (
          <blockquote className="mt-4 p-3 border-l-4 border-primary bg-content2 rounded-r-md text-sm text-foreground/80 italic">
            {draft.notes}
          </blockquote>
        )}
      </CardBody>
    </Card>
  );
};
