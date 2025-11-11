"use client";

import React from "react";

import { Synergy } from "@/data/synergyData";

import { FeaturedSynergies } from "./FeaturedSynergies";
import { SynergyAccordion } from "./SynergyAccordion";

interface BestPairingsProps {
  readonly synergiesByAdc: Record<string, Synergy[]>;
  readonly synergiesBySupport: Record<string, Synergy[]>;
}

export function BestPairings({
  synergiesByAdc,
  synergiesBySupport,
}: BestPairingsProps) {
  const adcAccordionItems = React.useMemo(
    () =>
      Object.entries(synergiesByAdc).map(([adc, synergies]) => ({
        id: adc,
        name: adc,
        synergies: synergies,
      })),
    [synergiesByAdc]
  );

  const supportAccordionItems = React.useMemo(
    () =>
      Object.entries(synergiesBySupport).map(([support, synergies]) => ({
        id: support,
        name: support,
        synergies: synergies,
      })),
    [synergiesBySupport]
  );

  return (
    <div className="space-y-12">
      <FeaturedSynergies />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SynergyAccordion
          title="By ADC"
          icon="ListChecks"
          iconColor="text-primary"
          items={adcAccordionItems}
          defaultExpandedKeys={[]}
          roleToList="support"
        />

        <SynergyAccordion
          title="By Support"
          icon="ListChecks"
          iconColor="text-success"
          items={supportAccordionItems}
          defaultExpandedKeys={[]}
          roleToList="adc"
        />
      </div>
    </div>
  );
}
