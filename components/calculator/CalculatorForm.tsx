"use client";

import { Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import React from "react";

import { RoleCategories } from "@/data/categoryData";
import { Champion } from "@/data/championData";
import { Selections } from "@/hooks/useMatchupCalculator";

import { ChampionSelector } from "./ChampionSelector";

type RoleToCalculate = "adc" | "support" | "both";

// A definitive list of the original 18 champions in your curated pool.
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
]);

interface CalculatorFormProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  categories: RoleCategories[];
  championMap: Map<string, Champion>;
  selections: Selections;
  onSelectionChange: (role: keyof Selections, name: string | null) => void;
  roleToCalculate: RoleToCalculate;
  onRoleChange: (role: RoleToCalculate) => void;
  isCalculating: boolean;
}

/**
 * A form component that contains the champion selectors for the calculator.
 * @param {CalculatorFormProps} props - The component's props.
 * @returns {JSX.Element}
 */
export function CalculatorForm({
  adcs,
  supports,
  allChampions,
  categories,
  championMap,
  selections,
  onSelectionChange,
  roleToCalculate,
  onRoleChange,
  isCalculating,
}: CalculatorFormProps) {
  const adcCategories = categories.find((c) => c.name === "ADC")?.categories;
  const supportCategories = categories.find(
    (c) => c.name === "Support"
  )?.categories;

  // Filter the champion pools to only include your core 18 champions for allied selections.
  const coreAdcs = adcs.filter((champ) => coreChampionNames.has(champ.name));
  const coreSupports = supports.filter((champ) =>
    coreChampionNames.has(champ.name)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="p-4 w-full">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-lg font-semibold text-success w-full text-center">
            Your Team
          </h3>
        </CardHeader>
        <CardBody className="p-0 space-y-4">
          <div>
            <ChampionSelector
              label="Allied ADC"
              champions={coreAdcs}
              categories={adcCategories}
              selectedChampionName={selections.alliedAdc}
              onSelect={(name) => onSelectionChange("alliedAdc", name)}
              championMap={championMap}
              isDisabled={
                roleToCalculate === "adc" || roleToCalculate === "both"
              }
              isLoading={isCalculating}
            />
          </div>
          <div>
            <ChampionSelector
              label="Allied Support"
              champions={coreSupports}
              categories={supportCategories}
              selectedChampionName={selections.alliedSupport}
              onSelect={(name) => onSelectionChange("alliedSupport", name)}
              championMap={championMap}
              isDisabled={
                roleToCalculate === "support" || roleToCalculate === "both"
              }
              isLoading={isCalculating}
            />
          </div>
        </CardBody>
      </Card>

      <div className="text-center space-y-8 pt-0 lg:pt-8 order-first lg:order-none">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Calculate best pick for...
          </h3>
          <Tabs
            selectedKey={roleToCalculate}
            onSelectionChange={(key) => onRoleChange(key as RoleToCalculate)}
            color="primary"
            aria-label="Role to calculate"
          >
            <Tab key="adc" title="ADC" />
            <Tab key="support" title="Support" />
            <Tab key="both" title="Both" />
          </Tabs>
        </div>
      </div>

      <Card className="p-4 w-full">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-lg font-semibold text-danger w-full text-center">
            Enemy Team
          </h3>
        </CardHeader>
        <CardBody className="p-0 space-y-4">
          <div>
            <ChampionSelector
              label="Enemy ADC"
              champions={allChampions.filter((c) => c.role.includes("ADC"))}
              categories={adcCategories}
              selectedChampionName={selections.enemyAdc}
              onSelect={(name) => onSelectionChange("enemyAdc", name)}
              championMap={championMap}
              isLoading={isCalculating}
            />
          </div>
          <div>
            <ChampionSelector
              label="Enemy Support"
              champions={allChampions.filter((c) => c.role.includes("Support"))}
              categories={supportCategories}
              selectedChampionName={selections.enemySupport}
              onSelect={(name) => onSelectionChange("enemySupport", name)}
              championMap={championMap}
              isLoading={isCalculating}
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
