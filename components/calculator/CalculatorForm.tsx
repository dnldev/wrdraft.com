// FILE: components/calculator/CalculatorForm.tsx
"use client";

import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";

import { ChampionSelector } from "./ChampionSelector";

interface Selections {
  alliedAdc: string | null;
  alliedSupport: string | null;
  enemyAdc: string | null;
  enemySupport: string | null;
}

interface CalculatorFormProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  championMap: Map<string, Champion>;
  selections: Selections;
  onSelectionChange: (role: keyof Selections, name: string | null) => void;
  roleToCalculate: "adc" | "support";
  onRoleChange: (role: "adc" | "support") => void;
  onCalculate: () => void;
  isCalculating: boolean;
  isSelectionEmpty: boolean;
}

export function CalculatorForm({
  adcs,
  supports,
  allChampions,
  championMap,
  selections,
  onSelectionChange,
  roleToCalculate,
  onRoleChange,
  onCalculate,
  isCalculating,
  isSelectionEmpty,
}: CalculatorFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="p-4 w-full">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-lg font-semibold text-success w-full text-center">
            Your Team
          </h3>
        </CardHeader>
        <CardBody className="p-0 space-y-6">
          <ChampionSelector
            label="ADC"
            champions={adcs}
            selectedChampionName={selections.alliedAdc}
            onSelect={(name) => onSelectionChange("alliedAdc", name)}
            championMap={championMap}
            isDisabled={roleToCalculate === "adc"}
          />
          <ChampionSelector
            label="Support"
            champions={supports}
            selectedChampionName={selections.alliedSupport}
            onSelect={(name) => onSelectionChange("alliedSupport", name)}
            championMap={championMap}
            isDisabled={roleToCalculate === "support"}
          />
        </CardBody>
      </Card>

      <div className="text-center space-y-8 pt-0 lg:pt-8 order-first lg:order-none">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Calculate best pick for...
          </h3>
          <Tabs
            selectedKey={roleToCalculate}
            onSelectionChange={(key) => onRoleChange(key as "adc" | "support")}
            color="primary"
            aria-label="Role to calculate"
          >
            <Tab key="adc" title="ADC" />
            <Tab key="support" title="Support" />
          </Tabs>
        </div>
        <div className="flex justify-center">
          <Button
            color="primary"
            size="lg"
            className="font-bold w-full md:w-auto"
            onPress={onCalculate}
            isLoading={isCalculating}
            isDisabled={isSelectionEmpty}
          >
            Calculate Best Pick
          </Button>
        </div>
      </div>

      <Card className="p-4 w-full">
        <CardHeader className="p-0 pb-4">
          <h3 className="text-lg font-semibold text-danger w-full text-center">
            Enemy Team
          </h3>
        </CardHeader>
        <CardBody className="p-0 space-y-6">
          <ChampionSelector
            label="ADC"
            champions={allChampions.filter((c) => c.role.includes("ADC"))}
            selectedChampionName={selections.enemyAdc}
            onSelect={(name) => onSelectionChange("enemyAdc", name)}
            championMap={championMap}
          />
          <ChampionSelector
            label="Support"
            champions={allChampions.filter((c) => c.role.includes("Support"))}
            selectedChampionName={selections.enemySupport}
            onSelect={(name) => onSelectionChange("enemySupport", name)}
            championMap={championMap}
          />
        </CardBody>
      </Card>
    </div>
  );
}
