"use client";

import {
  Accordion,
  AccordionItem,
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import React from "react";

import { Selections } from "@/hooks/useMatchupCalculator";
import { PairRecommendation, Recommendation } from "@/lib/calculator";
import {
  generatePairExplanation,
  generateSingleExplanation,
  generateSummaryLine,
} from "@/lib/generateExplanation";

/**
 * Determines the color for the score chip based on the score value.
 */
function getScoreColor(score: number): "success" | "danger" | "default" {
  if (score > 0) return "success";
  if (score < 0) return "danger";
  return "default";
}

/**
 * A title component for an AccordionItem, showing a recommended pair.
 */
const PairTitle = ({
  item,
  index,
}: {
  item: PairRecommendation;
  index: number;
}) => (
  <div className="flex w-full items-center gap-4">
    <div className="flex -space-x-4">
      <Avatar src={item.adc.portraitUrl} alt={item.adc.name} />
      <Avatar src={item.support.portraitUrl} alt={item.support.name} />
    </div>
    <div className="flex-grow space-y-1">
      <h4 className="text-lg font-bold text-white leading-tight">
        {index + 1}. {item.adc.name} + {item.support.name}
      </h4>
      <p className="text-xs text-foreground/70">
        {generateSummaryLine(item.breakdown)}
      </p>
    </div>
    <Chip
      color={getScoreColor(item.score)}
      variant="shadow"
      className="font-bold shrink-0"
    >
      Score: {item.score}
    </Chip>
  </div>
);

/**
 * A title component for an AccordionItem, showing a single champion recommendation.
 */
const SingleTitle = ({
  item,
  index,
  tierMap,
}: {
  item: Recommendation;
  index: number;
  tierMap: Map<string, string>;
}) => (
  <div className="flex w-full items-center gap-4">
    <Avatar
      src={item.champion.portraitUrl}
      className="w-12 h-12"
      alt={item.champion.name}
    />
    <div className="flex-grow space-y-1">
      <h4 className="text-lg font-bold text-white leading-tight">
        {index + 1}. {item.champion.name}
        {tierMap.get(item.champion.name) && (
          <Chip size="sm" variant="flat" className="ml-2 text-xs">
            {tierMap.get(item.champion.name)} Tier
          </Chip>
        )}
      </h4>
      <p className="text-xs text-foreground/70">
        {generateSummaryLine(item.breakdown)}
      </p>
    </div>
    <Chip
      color={getScoreColor(item.score)}
      variant="shadow"
      className="font-bold shrink-0"
    >
      Score: {item.score}
    </Chip>
  </div>
);

/**
 * A type guard to determine if a recommendation is for a pair.
 */
function isPairRecommendation(
  res: Recommendation | PairRecommendation
): res is PairRecommendation {
  return "adc" in res && "support" in res;
}

/**
 * Renders a list of recommendations as an expandable accordion.
 */
export const RecommendationResults: React.FC<{
  results: (Recommendation | PairRecommendation)[];
  tierMap: Map<string, string>;
  selections: Selections;
}> = ({ results, tierMap, selections }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-bold text-white">Recommendations</h3>
      </CardHeader>
      <Divider />
      <CardBody className="p-2">
        <Accordion selectionMode="multiple">
          {results.map((item, index) => {
            if (isPairRecommendation(item)) {
              return (
                <AccordionItem
                  key={`${item.adc.id}-${item.support.id}`}
                  aria-label={`Recommendation for ${item.adc.name} and ${item.support.name}`}
                  title={<PairTitle item={item} index={index} />}
                >
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap px-2 pb-2">
                    {generatePairExplanation(item)}
                  </p>
                </AccordionItem>
              );
            }
            return (
              <AccordionItem
                key={item.champion.id}
                aria-label={`Recommendation for ${item.champion.name}`}
                title={
                  <SingleTitle item={item} index={index} tierMap={tierMap} />
                }
              >
                <p className="text-sm text-foreground/80 whitespace-pre-wrap px-2 pb-2">
                  {generateSingleExplanation(item, selections)}
                </p>
              </AccordionItem>
            );
          })}
        </Accordion>
        {results.length === 0 && (
          <p className="text-foreground/70 text-center p-4">
            No significant synergies or counters found.
          </p>
        )}
      </CardBody>
    </Card>
  );
};
