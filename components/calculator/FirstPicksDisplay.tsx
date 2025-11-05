"use client";

import { Avatar, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";
import { FirstPick } from "@/data/firstPickData";

const FirstPickCard: React.FC<{
  pick: FirstPick;
  champion?: Champion;
  tier?: string;
}> = ({ pick, champion, tier }) => (
  <Card className="p-4">
    <CardHeader className="p-0 pb-2">
      <div className="flex items-center gap-3">
        {champion && (
          <Avatar src={champion.portraitUrl} alt={champion.name} size="md" />
        )}
        <div className="flex-grow">
          <h4 className="text-lg font-bold text-white leading-tight">
            {pick.name}{" "}
            {champion?.comfort && (
              <span
                className={
                  champion.comfort.startsWith("★")
                    ? "text-primary"
                    : "text-slate-400"
                }
              >
                {champion.comfort.split(" ")[0]}
              </span>
            )}
          </h4>
          {tier && <p className="text-xs text-foreground/60">{tier} Tier</p>}
        </div>
      </div>
    </CardHeader>
    <CardBody className="p-0 pt-2">
      <p className="text-sm text-foreground/70">{pick.reasoning}</p>
    </CardBody>
  </Card>
);

interface FirstPicksDisplayProps {
  firstPicks: FirstPick[];
  championMap: Map<string, Champion>;
  tierMap: Map<string, string>;
  role: "adc" | "support";
}

export function FirstPicksDisplay({
  firstPicks,
  championMap,
  tierMap,
  role,
}: FirstPicksDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-2xl font-bold text-white">
          Safe First Picks for {role === "adc" ? "ADC" : "Support"}
        </h3>
      </CardHeader>
      <Divider />
      <CardBody className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {firstPicks.map((pick) => (
          <FirstPickCard
            key={pick.name}
            pick={pick}
            champion={championMap.get(pick.name)}
            tier={tierMap.get(pick.name)}
          />
        ))}
      </CardBody>
    </Card>
  );
}
