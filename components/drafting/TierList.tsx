"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

import { TierListData } from "@/data/tierListData";
import { CURRENT_PATCH } from "@/lib/constants";

import { LucideIcon } from "../core/LucideIcon";

const tierColors: {
  [key: string]: string; // Use string for dynamic class names
} = {
  "S+": "border-success", // Teal
  S: "border-primary", // Gold
  A: "border-warning", // Blue
  B: "border-primary", // Gold
  C: "border-danger", // Red
};

interface TierRowProps {
  readonly tier: string;
  readonly champions: string[];
}

const TierRow: React.FC<TierRowProps> = ({ tier, champions }) => {
  const borderColorClass = tierColors[tier] || "border-default";
  return (
    <div
      className={`bg-background rounded-lg p-4 border-l-4 ${borderColorClass}`}
    >
      <h4 className="text-xl font-semibold text-white/90">{tier} Tier</h4>
      <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
        {champions.join(", ")}
      </p>
    </div>
  );
};

export function TierList({ tierList }: { readonly tierList: TierListData }) {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
        <LucideIcon name="ChartBar" className="text-primary" />
        <h2 className="text-3xl font-bold text-primary text-center">
          Meta Tier List (Patch {CURRENT_PATCH})
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 md:p-6 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Dragon Lane (ADC)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tierList.adc).map(([tier, champions]) => (
              <TierRow key={`adc-${tier}`} tier={tier} champions={champions} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Support</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(tierList.support).map(([tier, champions]) => (
              <TierRow
                key={`support-${tier}`}
                tier={tier}
                champions={champions}
              />
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
