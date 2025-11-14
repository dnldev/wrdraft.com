// components/history/TeamDisplay.tsx
"use client";

import { Avatar, Chip } from "@heroui/react";

import { Champion } from "@/data/championData";
import { KDA } from "@/types/draft";

const formatKda = (kda: KDA) => `${kda.k} / ${kda.d} / ${kda.a}`;

const getRatingColor = (rating?: string[]) => {
  if (rating?.includes("MVP")) return "warning";
  if (rating?.includes("SVP")) return "default";
  if (rating?.includes("S")) return "primary";
  if (rating?.includes("A")) return "secondary";
  return "default";
};

const PlayerDisplay: React.FC<{
  championName: string | null;
  kda?: KDA;
  championMap: Map<string, Champion>;
}> = ({ championName, kda, championMap }) => {
  const champion = championName ? championMap.get(championName) : null;
  if (!champion) return null;

  return (
    <div className="flex items-center gap-2">
      <Avatar src={champion.portraitUrl} size="md" />
      <div className="flex-grow">
        <p className="font-semibold text-white">{champion.name}</p>
        {kda && <p className="text-xs text-foreground/60">{formatKda(kda)}</p>}
      </div>
      {kda?.rating && kda.rating.length > 0 && (
        <Chip size="sm" color={getRatingColor(kda.rating)} variant="flat">
          {kda.rating.join(" ")}
        </Chip>
      )}
    </div>
  );
};

interface TeamDisplayProps {
  label: string;
  color: "success" | "danger";
  adcName: string | null;
  supportName: string | null;
  adcKda?: KDA;
  supportKda?: KDA;
  championMap: Map<string, Champion>;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({
  label,
  color,
  adcName,
  supportName,
  adcKda,
  supportKda,
  championMap,
}) => {
  const colorClasses = {
    success: "text-success",
    danger: "text-danger",
  };

  return (
    <div className="space-y-2">
      <p
        className={`text-xs font-bold ${colorClasses[color]} uppercase tracking-wider`}
      >
        {label}
      </p>
      <PlayerDisplay
        championName={adcName}
        kda={adcKda}
        championMap={championMap}
      />
      <PlayerDisplay
        championName={supportName}
        kda={supportKda}
        championMap={championMap}
      />
    </div>
  );
};
