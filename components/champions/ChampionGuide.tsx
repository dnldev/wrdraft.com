// components/champions/ChampionGuide.tsx
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

import { Champion } from "@/data/championData";
import { ChampionStats } from "@/lib/stats";

import { BuildPath } from "./BuildPath";

interface ChampionGuideProps {
  readonly champion: Champion;
  readonly stats?: ChampionStats;
}

export function ChampionGuide({ champion, stats }: ChampionGuideProps) {
  const averageKdaString = stats?.averageKda
    ? `${stats.averageKda.k} / ${stats.averageKda.d} / ${stats.averageKda.a}`
    : "";

  return (
    <Card className="p-0 bg-content1 shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {champion.name}{" "}
                {champion.comfort && (
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
              </h3>
              <p className="text-sm text-foreground/70">{champion.role}</p>
            </div>
            {stats && stats.gamesPlayed > 0 && (
              <div className="flex flex-col items-end gap-2 text-xs">
                <div className="flex gap-2">
                  <Chip
                    color={stats.winRate >= 50 ? "success" : "danger"}
                    variant="shadow"
                    className="font-bold"
                  >
                    {stats.winRate}% WR
                  </Chip>
                  <Chip variant="flat">
                    {stats.gamesPlayed} Game{stats.gamesPlayed > 1 ? "s" : ""}
                  </Chip>
                </div>
                <Chip variant="light">Avg KDA: {averageKdaString}</Chip>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-8 p-4 md:p-6">
        {champion.howToPlay.length > 0 && (
          <>
            <div>
              <h4 className="text-2xl font-bold text-primary mb-4">
                How to Play
              </h4>
              <ul className="list-none space-y-4 text-foreground/80">
                {champion.howToPlay.map((item) => (
                  <li key={item.tip}>
                    <strong className="block text-white">{item.tip}</strong>
                    <p className="text-sm">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
            <Divider />
          </>
        )}

        <div>
          <h4 className="text-2xl font-bold text-primary mb-4">
            Matchups & Synergies
          </h4>
          <div className="space-y-4">
            <Card className="p-4 bg-background/50">
              <h5 className="font-bold text-warning mb-2">Ideal Synergies</h5>
              <p className="text-sm text-foreground/80">
                <strong className="text-white">Your Pool:</strong>{" "}
                {champion.matchups.userSynergies.join(", ")}
              </p>
              <p className="text-sm text-foreground/80 mt-1">
                <strong className="text-white">Meta Pool:</strong>{" "}
                {champion.matchups.metaSynergies.join(", ")}
              </p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Card className="p-4 bg-background/50">
                <h5 className="font-bold text-success mb-2">
                  Good Against (You Counter)
                </h5>
                <p className="text-foreground/80">
                  {champion.matchups.goodAgainst.join(", ")}
                </p>
              </Card>
              <Card className="p-4 bg-background/50">
                <h5 className="font-bold text-danger mb-2">
                  Bad Against (You are Countered by)
                </h5>
                <p className="text-foreground/80">
                  {champion.matchups.badAgainst.join(", ")}
                </p>
              </Card>
            </div>
          </div>
        </div>

        {champion.builds.length > 0 && (
          <>
            <Divider />
            <div>
              <h4 className="text-2xl font-bold text-primary mb-4">
                Build Paths
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {champion.builds.map((build) => (
                  <BuildPath key={build.name} build={build} />
                ))}
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
