"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { FirstPick } from "@/data/firstPickData";
import { PairRecommendation } from "@/lib/calculator";
import { Selections } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";
import { BanPhase, LockedBansDisplay } from "./BanPhase";
import { CalculatorForm } from "./CalculatorForm";
import { CalculatorResultsContent } from "./CalculatorResultsContent";

interface DefaultCalculatorViewProps {
  readonly bansLocked: boolean;
  readonly bannedChampions: Set<string>;
  readonly championMap: Map<string, Champion>;
  readonly yourBans: readonly string[];
  readonly enemyBans: readonly string[];
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly allChampions: Champion[];
  readonly categories: RoleCategories[];
  readonly selections: Selections;
  readonly isCalculating: boolean;
  readonly isSelectionEmpty: boolean;
  readonly combinedFirstPicks: FirstPick[];
  readonly championTierMap: Map<string, string>;
  readonly results: PairRecommendation[] | null;
  readonly onSlotClick: (team: "your" | "enemy", index: number) => void;
  readonly onLockIn: () => void;
  readonly onSelectionChange: (
    role: keyof Selections,
    name: string | null
  ) => void;
}

export const DefaultCalculatorView: React.FC<DefaultCalculatorViewProps> = ({
  bansLocked,
  bannedChampions,
  championMap,
  yourBans,
  enemyBans,
  adcs,
  supports,
  allChampions,
  categories,
  selections,
  isCalculating,
  isSelectionEmpty,
  combinedFirstPicks,
  championTierMap,
  results,
  onSlotClick,
  onLockIn,
  onSelectionChange,
}) => {
  return (
    <>
      <Card className="p-0">
        <CardHeader className="flex flex-col items-center justify-center gap-3 p-4 md:p-6">
          <LucideIcon name="Calculator" className="text-primary" />
          <h2 className="text-3xl font-bold text-primary text-center">
            Matchup Calculator
          </h2>
          <p className="text-sm text-foreground/70 text-center max-w-2xl">
            {bansLocked
              ? "Select the lane participants to get a recommendation."
              : "Select the bans for both teams."}
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="p-4 md:p-6">
          {bansLocked ? (
            <div className="space-y-8">
              <LockedBansDisplay
                bannedChampions={bannedChampions}
                championMap={championMap}
              />
              <CalculatorForm
                adcs={adcs}
                supports={supports}
                allChampions={allChampions}
                categories={categories}
                championMap={championMap}
                selections={selections}
                onSelectionChange={onSelectionChange}
                isCalculating={isCalculating}
              />
            </div>
          ) : (
            <BanPhase
              championMap={championMap}
              yourBans={yourBans}
              enemyBans={enemyBans}
              onSlotClick={onSlotClick}
              onLockIn={onLockIn}
            />
          )}
        </CardBody>
      </Card>
      <CalculatorResultsContent
        bansLocked={bansLocked}
        isSelectionEmpty={isSelectionEmpty}
        combinedFirstPicks={combinedFirstPicks}
        championMap={championMap}
        championTierMap={championTierMap}
        results={results}
      />
    </>
  );
};
