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
import { PairRecommendation } from "@/lib/calculator";
import {
  generatePairExplanation,
  generateSummaryLine,
} from "@/lib/generateExplanation";

/**
 * Determines the color for the score chip based on the score value.
 * @param {number} score - The recommendation score.
 * @returns {"success" | "danger" | "default"} The color for the Chip component.
 */
function getScoreColor(score: number): "success" | "danger" | "default" {
  if (score > 0) return "success";
  if (score < 0) return "danger";
  return "default";
}

/**
 * A title component for an AccordionItem, showing a recommended pair.
 * @param {object} props - The component props.
 * @returns {JSX.Element}
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
 * Renders a list of pair recommendations as an expandable accordion.
 * @param {object} props - The component props.
 * @returns {JSX.Element}
 */
export const RecommendationResults: React.FC<{
  results: PairRecommendation[];
  tierMap: Map<string, string>;
  selections: Selections;
}> = ({ results }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-bold text-white">Recommendations</h3>
      </CardHeader>
      <Divider />
      <CardBody className="p-2">
        <Accordion selectionMode="multiple">
          {results.map((item, index) => (
            <AccordionItem
              key={`${item.adc.id}-${item.support.id}`}
              aria-label={`Recommendation for ${item.adc.name} and ${item.support.name}`}
              title={<PairTitle item={item} index={index} />}
            >
              <p className="text-sm text-foreground/80 whitespace-pre-wrap px-2 pb-2">
                {generatePairExplanation(item)}
              </p>
            </AccordionItem>
          ))}
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
