import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";
import { KDA, LaneOutcome, MatchOutcome, SavedDraft } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";

interface HistoryCardProps {
  readonly draft: SavedDraft;
  readonly championMap: Map<string, Champion>;
  readonly onDelete: (id: string) => void;
  readonly isDeleting: boolean;
}

const TeamDisplay: React.FC<{
  adcName: string | null;
  supportName: string | null;
  kda?: { adc: KDA; support: KDA };
  championMap: Map<string, Champion>;
}> = ({ adcName, supportName, kda, championMap }) => {
  const adc = adcName ? championMap.get(adcName) : null;
  const support = supportName ? championMap.get(supportName) : null;
  const formatKda = (kdaObj?: KDA) =>
    kdaObj ? `${kdaObj.k}/${kdaObj.d}/${kdaObj.a}` : null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {adc && <Avatar src={adc.portraitUrl} size="md" />}
        <div>
          <p className="font-semibold text-white">{adc?.name}</p>
          {kda?.adc && (
            <p className="text-xs text-foreground/60">{formatKda(kda.adc)}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {support && <Avatar src={support.portraitUrl} size="md" />}
        <div>
          <p className="font-semibold text-white">{support?.name}</p>
          {kda?.support && (
            <p className="text-xs text-foreground/60">
              {formatKda(kda.support)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const getOutcomeChip = (outcome: MatchOutcome | LaneOutcome) => {
  switch (outcome) {
    case "win": {
      return <Chip color="success">Win</Chip>;
    }
    case "loss": {
      return <Chip color="danger">Loss</Chip>;
    }
    case "even": {
      return <Chip>Even</Chip>;
    }
    case "remake": {
      return <Chip>Remake</Chip>;
    }
    default: {
      return null;
    }
  }
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, index) => (
      <LucideIcon
        key={index}
        name="Star"
        size={16}
        className={
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }
      />
    ))}
  </div>
);

/**
 * Displays a single saved draft record with all relevant information and a delete action.
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
            <Button isIconOnly variant="light" size="sm">
              <LucideIcon name="EllipsisVertical" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(key) => {
              if (key === "delete") {
                onDelete(draft.id);
              }
            }}
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
      <CardBody className="p-4 space-y-4">
        <div className="flex items-start justify-around">
          <TeamDisplay
            adcName={draft.picks.alliedAdc}
            supportName={draft.picks.alliedSupport}
            kda={draft.kda}
            championMap={championMap}
          />
          <span className="text-2xl font-thin text-foreground/50 pt-8">VS</span>
          <TeamDisplay
            adcName={draft.picks.enemyAdc}
            supportName={draft.picks.enemySupport}
            championMap={championMap}
          />
        </div>
        <Divider />
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-foreground/70 font-semibold">
              Matchup Feel
            </span>
            <StarRating rating={draft.matchupFeel} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70 font-semibold">
              Game Result
            </span>
            {getOutcomeChip(draft.matchOutcome)}
          </div>
          {draft.laneOutcome && (
            <div className="flex justify-between items-center">
              <span className="text-foreground/70 font-semibold">
                Lane Result
              </span>
              {getOutcomeChip(draft.laneOutcome)}
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-foreground/70 font-semibold">
              Your Archetype
            </span>
            <Chip color="default">{draft.archetypes.your}</Chip>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70 font-semibold">
              Enemy Archetype
            </span>
            <Chip color="default">{draft.archetypes.enemy}</Chip>
          </div>
        </div>

        {(draft.bans.your.length > 0 || draft.bans.enemy.length > 0) && (
          <div>
            <Divider className="my-2" />
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <LucideIcon name="Ban" className="text-danger" size={16} />
              <p className="font-semibold text-foreground/70">Bans:</p>
              {[...draft.bans.your, ...draft.bans.enemy].map((b) => (
                <span key={b} className="text-foreground/80">
                  {championMap.get(b)?.name || b}
                </span>
              ))}
            </div>
          </div>
        )}

        {draft.notes && (
          <blockquote className="mt-4 p-3 border-l-4 border-primary bg-content2 rounded-r-md text-sm text-foreground/80 italic">
            {draft.notes}
          </blockquote>
        )}
      </CardBody>
    </Card>
  );
};
