// components/history/HistoryStats.tsx
"use client";

import { Chip } from "@heroui/react";

import { LaneOutcome, MatchOutcome, SavedDraft } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";
import { StatRow } from "./StatRow";

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
  <div className="flex" aria-label={`Rating: ${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => (
      <LucideIcon
        key={`star-rating-${index}`}
        name="Star"
        size={16}
        className={
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }
        aria-hidden="true"
      />
    ))}
  </div>
);

const getScoreColor = (score: number) => {
  if (score > 0) return "success";
  if (score < 0) return "danger";
  return "default";
};

interface HistoryStatsProps {
  draft: SavedDraft;
}

export const HistoryStats: React.FC<HistoryStatsProps> = ({ draft }) => (
  <div className="space-y-3 text-sm">
    <StatRow label="Draft Score">
      <Chip color={getScoreColor(draft.result.overallScore)}>
        {draft.result.overallScore > 0
          ? `+${draft.result.overallScore}`
          : draft.result.overallScore}
      </Chip>
    </StatRow>
    <StatRow label="Est. Win Chance">
      <Chip color={draft.result.winChance >= 50 ? "success" : "danger"}>
        {draft.result.winChance}%
      </Chip>
    </StatRow>
    <StatRow label="Matchup Feel">
      <StarRating rating={draft.matchupFeel} />
    </StatRow>
    <StatRow label="Game Result">{getOutcomeChip(draft.matchOutcome)}</StatRow>
    {draft.laneOutcome && (
      <StatRow label="Lane Result">{getOutcomeChip(draft.laneOutcome)}</StatRow>
    )}
  </div>
);
