"use client";

import { Avatar, Card, CardBody, CardHeader } from "@heroui/react";
import React, { JSX, useMemo } from "react";

import { Champion } from "@/data/championData";
import { FirstPick } from "@/data/firstPickData";

import { LucideIcon } from "../core/LucideIcon";

interface FirstPickCardProps {
  readonly pick: FirstPick;
  readonly champion: Champion;
  readonly tier: string;
}

/**
 * A single card representing a safe first pick champion, including its reasoning.
 * @param {object} props - The component props.
 * @returns {JSX.Element}
 */
const FirstPickCard: React.FC<FirstPickCardProps> = ({
  pick,
  champion,
  tier,
}: FirstPickCardProps): JSX.Element => (
  <Card className="p-4 bg-content2">
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
                  champion.comfort.startsWith("S")
                    ? "text-primary"
                    : "text-slate-400"
                }
              >
                {champion.comfort}
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
  readonly firstPicks: FirstPick[];
  readonly championMap: Map<string, Champion>;
  readonly tierMap: Map<string, string>;
}

/**
 * A component that displays safe first picks in a grid.
 * This is shown when the user has locked in bans but not yet selected any champions.
 * @param {FirstPicksDisplayProps} props - The component props.
 * @returns {JSX.Element}
 */
export function FirstPicksDisplay({
  firstPicks,
  championMap,
  tierMap,
}: FirstPicksDisplayProps) {
  const validFirstPicks = useMemo(() => {
    return firstPicks
      .map((pick) => ({
        pick,
        champion: championMap.get(pick.name),
        tier: tierMap.get(pick.name),
      }))
      .filter(
        (item): item is { pick: FirstPick; champion: Champion; tier: string } =>
          Boolean(item.champion && item.tier)
      );
  }, [firstPicks, championMap, tierMap]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <LucideIcon name="ShieldCheck" className="text-primary" />
          <h3 className="text-2xl font-bold text-white">Safe First Picks</h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {validFirstPicks.map(({ pick, champion, tier }) => (
            <FirstPickCard
              key={pick.name}
              pick={pick}
              champion={champion}
              tier={tier}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
