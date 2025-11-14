"use client";

import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import React from "react";

import { TierListData } from "@/data/tierListData";
import { CURRENT_PATCH } from "@/lib/constants";
import { ChampionStats } from "@/lib/stats";

import { LucideIcon } from "../core/LucideIcon";

const tierColors: {
  [key: string]: string;
} = {
  "S+": "border-success",
  S: "border-primary",
  A: "border-warning",
  B: "border-default",
  C: "border-danger",
};

interface TierRowProps {
  readonly tier: string;
  readonly champions: string[];
  readonly championStats: Map<string, ChampionStats>;
}

const TierRow: React.FC<TierRowProps> = ({
  tier,
  champions,
  championStats,
}) => {
  const borderColorClass = tierColors[tier] || "border-default";
  return (
    <div
      className={`bg-background rounded-lg p-4 border-l-4 ${borderColorClass}`}
    >
      <h4 className="text-xl font-semibold text-white/90">{tier} Tier</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {champions.map((championName) => {
          const stats = championStats.get(championName);
          const hasStats = stats && stats.gamesPlayed > 0;

          return (
            <Chip key={championName} variant="flat" size="sm">
              <span className="font-medium">{championName}</span>
              {hasStats && (
                <span
                  className={`ml-2 font-normal ${
                    stats.winRate >= 50 ? "text-success" : "text-danger"
                  }`}
                >
                  ({stats.winRate}% / {stats.gamesPlayed}g)
                </span>
              )}
            </Chip>
          );
        })}
      </div>
    </div>
  );
};

interface TierListProps {
  readonly tierList: TierListData;
  readonly championStats: Map<string, ChampionStats>;
}

export function TierList({ tierList, championStats }: TierListProps) {
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
              <TierRow
                key={`adc-${tier}`}
                tier={tier}
                champions={champions}
                championStats={championStats}
              />
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
                championStats={championStats}
              />
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
