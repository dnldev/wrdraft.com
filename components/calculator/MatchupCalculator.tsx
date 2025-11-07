"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { useMatchupCalculator } from "@/hooks/useMatchupCalculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";

import { LucideIcon } from "../core/LucideIcon";
import { CalculatorForm } from "./CalculatorForm";
import { FirstPicksDisplay } from "./FirstPicksDisplay";
import { RecommendationResults } from "./RecommendationResults";

interface MatchupCalculatorProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  firstPicks: FirstPickData;
  tierList: TierListData;
  categories: RoleCategories[];
}

/**
 * The main component for the Matchup Calculator feature.
 * It orchestrates the UI by initializing the `useMatchupCalculator` hook and passing
 * the resulting state and handlers to its child presentational components.
 * @param {MatchupCalculatorProps} props - The raw data fetched server-side, including champions and matrices.
 * @returns {JSX.Element} The fully interactive Matchup Calculator UI.
 */
export function MatchupCalculator(props: MatchupCalculatorProps) {
  // DEBUG: Log props received from the parent (app/page.tsx)
  console.log("DEBUG (MatchupCalculator): Received props", {
    hasCategories: !!props.categories,
  });

  const {
    roleToCalculate,
    selections,
    results,
    isCalculating,
    championMap,
    championTierMap,
    handleSelectionChange,
    handleRoleChange,
    handleCalculate,
    isSelectionEmpty,
    currentFirstPicks,
  } = useMatchupCalculator(props);

  return (
    <div className="space-y-8">
      <Card className="p-0">
        <CardHeader className="flex flex-col items-center justify-center gap-3 p-4 md:p-6">
          <LucideIcon name="Calculator" className="text-primary" />
          <h2 className="text-3xl font-bold text-primary text-center">
            Matchup Calculator
          </h2>
          <p className="text-sm text-foreground/70 text-center max-w-2xl">
            Select the lane participants to get a weighted recommendation for
            your pick.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="p-4 md:p-6">
          <CalculatorForm
            adcs={props.adcs}
            supports={props.supports}
            allChampions={props.allChampions}
            categories={props.categories}
            championMap={championMap}
            selections={selections}
            onSelectionChange={handleSelectionChange}
            roleToCalculate={roleToCalculate}
            onRoleChange={handleRoleChange}
            onCalculate={handleCalculate}
            isCalculating={isCalculating}
            isSelectionEmpty={isSelectionEmpty}
          />
        </CardBody>
      </Card>

      {results && (
        <RecommendationResults results={results} tierMap={championTierMap} />
      )}

      {isSelectionEmpty && !results && (
        <FirstPicksDisplay
          firstPicks={currentFirstPicks}
          championMap={championMap}
          tierMap={championTierMap}
          role={roleToCalculate}
        />
      )}
    </div>
  );
}
