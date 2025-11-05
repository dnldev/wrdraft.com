// FILE: components/calculator/RecommendationResults.tsx
"use client";

import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import React from "react";

import { Recommendation } from "@/lib/calculator";

import { LucideIcon } from "../core/LucideIcon";

const RecommendationCard: React.FC<{
  item: Recommendation;
  index: number;
  tierMap: Map<string, string>;
}> = ({ item, index, tierMap }) => {
  const { champion, score, breakdown } = item;
  const tier = tierMap.get(champion.name);

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
          {champion.comfort && (
            <span
              className={
                champion.comfort.startsWith("★")
                  ? "text-primary"
                  : "text-slate-400"
              }
            >
              {champion.comfort.split(" ")[0]}
            </span>
          )}
          {tier && (
            <Chip size="sm" variant="flat" className="ml-2 text-xs">
              {tier} Tier
            </Chip>
          )}
        </h4>
        <div className="flex flex-wrap gap-2 mt-1">
          {breakdown.map((breakdownItem, i) => (
            <Chip
              key={i}
              size="sm"
              color={breakdownItem.value > 0 ? "success" : "danger"}
              variant="flat"
              startContent={
                <LucideIcon
                  name={breakdownItem.value > 0 ? "ThumbsUp" : "ThumbsDown"}
                  size={12}
                  className="mr-1"
                />
              }
            >
              {breakdownItem.reason}: {breakdownItem.value > 0 ? "+" : ""}
              {breakdownItem.value}
            </Chip>
          ))}
        </div>
      </div>
      <Chip
        color={score > 0 ? "success" : score < 0 ? "danger" : "default"}
        variant="shadow"
        className="font-bold"
      >
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
