"use client";

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import React, { memo } from "react";

import { Recommendation } from "@/lib/calculator";

import { LucideIcon } from "../core/LucideIcon";

/**
 * Displays the comfort rating symbol with appropriate styling.
 * @param {{ comfort: string | null }} { comfort }
 * @returns {JSX.Element | null}
 */
const ComfortIndicator = memo(function ComfortIndicator({
  comfort,
}: {
  comfort: string | null;
}) {
  if (!comfort) {
    return null;
  }
  const symbol = comfort.split(" ")[0];
  const isPrimary = symbol.startsWith("★");
  const className = isPrimary ? "text-primary" : "text-slate-400";

  return <span className={className}>{symbol}</span>;
});

/**
 * Displays a single chip representing a breakdown of the recommendation score.
 * @param {{ item: Recommendation['breakdown'][0] }} { item }
 * @returns {JSX.Element}
 */
const BreakdownChip = memo(function BreakdownChip({
  item,
}: {
  item: Recommendation["breakdown"][0];
}) {
  const isPositive = item.value > 0;
  const color = isPositive ? "success" : "danger";
  const iconName = isPositive ? "ThumbsUp" : "ThumbsDown";
  const sign = isPositive ? "+" : "";

  return (
    <Chip
      size="sm"
      color={color}
      variant="flat"
      startContent={<LucideIcon name={iconName} size={12} className="mr-1" />}
    >
      {item.reason}: {sign}
      {item.value}
    </Chip>
  );
});

/**
 * Determines the color for the score chip based on the score value.
 * @param {number} score The recommendation score.
 * @returns {"success" | "danger" | "default"} The color for the Chip component.
 */
function getScoreColor(score: number): "success" | "danger" | "default" {
  if (score > 0) {
    return "success";
  }
  if (score < 0) {
    return "danger";
  }
  return "default";
}

const RecommendationCard: React.FC<{
  item: Recommendation;
  index: number;
  tierMap: Map<string, string>;
}> = ({ item, index, tierMap }) => {
  const { champion, score, breakdown } = item;
  const tier = tierMap.get(champion.name);
  const scoreColor = getScoreColor(score);

  return (
    <Card
      key={champion.id}
      className="p-3 bg-background/50 flex-row items-center gap-4"
    >
      <Avatar
        src={champion.portraitUrl}
        className="w-12 h-12"
        alt={champion.name}
      />
      <div className="flex-grow">
        <h4 className="text-lg font-bold text-white">
          {index + 1}. {champion.name}{" "}
          <ComfortIndicator comfort={champion.comfort} />
          {tier && (
            <Chip size="sm" variant="flat" className="ml-2 text-xs">
              {tier} Tier
            </Chip>
          )}
        </h4>
        <div className="flex flex-wrap gap-2 mt-1">
          {breakdown.map((breakdownItem) => (
            <BreakdownChip key={breakdownItem.reason} item={breakdownItem} />
          ))}
        </div>
      </div>
      <Chip color={scoreColor} variant="shadow" className="font-bold">
        Score: {score}
      </Chip>
    </Card>
  );
};

export const RecommendationResults: React.FC<{
  results: Recommendation[];
  tierMap: Map<string, string>;
}> = ({ results, tierMap }) => (
  <Card>
    <CardHeader>
      <h3 className="text-2xl font-bold text-white">Recommendations</h3>
    </CardHeader>
    <Divider />
    <CardBody className="space-y-2 p-2">
      {results.length > 0 ? (
        results.map((item, index) => (
          <RecommendationCard
            key={item.champion.id}
            item={item}
            index={index}
            tierMap={tierMap}
          />
        ))
      ) : (
        <p className="text-foreground/70 text-center p-4">
          No significant synergies or counters found for the selected champions.
        </p>
      )}
    </CardBody>
  </Card>
);
