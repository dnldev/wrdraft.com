"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { Selections } from "@/types/draft";

import { ChampionSelector } from "./ChampionSelector";

const coreChampionNames = new Set([
  "Varus",
  "Jinx",
  "Lucian",
  "Xayah",
  "Jhin",
  "Miss Fortune",
  "Caitlyn",
  "Kai'Sa",
  "Ashe",
  "Braum",
  "Nami",
  "Milio",
  "Leona",
  "Bard",
  "Zilean",
  "Thresh",
  "Morgana",
  "Lulu",
  "Akshan",
  "Zeri",
  "Corki",
  "Draven",
  "Ezreal",
  "Janna",
  "Karma",
  "Lux",
  "Maokai",
  "Blitzcrank",
  "Nautilus",
]);

interface CalculatorFormProps {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly allChampions: Champion[];
  readonly categories: RoleCategories[];
  readonly championMap: Map<string, Champion>;
  readonly selections: Selections;
  readonly onSelectionChange: (
    role: keyof Selections,
    name: string | null
  ) => void;
  readonly isCalculating: boolean;
}

/**
 * A form component for the champion picking phase.
 */
export function CalculatorForm({
  adcs,
  supports,
  allChampions,
  categories,
  championMap,
  selections,
  onSelectionChange,
  isCalculating,
}: CalculatorFormProps) {
  const adcCategories = categories.find((c) => c.name === "ADC")?.categories;
  const supportCategories = categories.find(
    (c) => c.name === "Support"
  )?.categories;

  const coreAdcs = adcs.filter((champ) => coreChampionNames.has(champ.name));
  const coreSupports = supports.filter((champ) =>
    coreChampionNames.has(champ.name)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-4 w-full">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-lg font-semibold text-success w-full text-center">
            Your Team
          </h3>
        </CardHeader>
        <CardBody className="p-0 space-y-4">
          <ChampionSelector
            label="Allied ADC"
            champions={coreAdcs}
            categories={adcCategories}
            selectedChampionName={selections.alliedAdc}
            onSelect={(name) => onSelectionChange("alliedAdc", name)}
            championMap={championMap}
            isLoading={isCalculating}
          />
          <ChampionSelector
            label="Allied Support"
            champions={coreSupports}
            categories={supportCategories}
            selectedChampionName={selections.alliedSupport}
            onSelect={(name) => onSelectionChange("alliedSupport", name)}
            championMap={championMap}
            isLoading={isCalculating}
          />
        </CardBody>
      </Card>
      <Card className="p-4 w-full">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-lg font-semibold text-danger w-full text-center">
            Enemy Team
          </h3>
        </CardHeader>
        <CardBody className="p-0 space-y-4">
          <ChampionSelector
            label="Enemy ADC"
            champions={allChampions.filter((c) => c.role.includes("ADC"))}
            categories={adcCategories}
            selectedChampionName={selections.enemyAdc}
            onSelect={(name) => onSelectionChange("enemyAdc", name)}
            championMap={championMap}
            isLoading={isCalculating}
          />
          <ChampionSelector
            label="Enemy Support"
            champions={allChampions.filter((c) => c.role.includes("Support"))}
            categories={supportCategories}
            selectedChampionName={selections.enemySupport}
            onSelect={(name) => onSelectionChange("enemySupport", name)}
            championMap={championMap}
            isLoading={isCalculating}
          />
        </CardBody>
      </Card>
    </div>
  );
}
