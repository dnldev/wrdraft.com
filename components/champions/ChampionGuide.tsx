import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

import { Champion } from "@/data/championData";

import { BuildPath } from "./BuildPath";

export function ChampionGuide({ champion }: { champion: Champion }) {
  const comfortSymbol = champion.comfort ? champion.comfort.split(" ")[0] : "";

  return (
    <Card className="p-0 bg-content1 shadow-lg">
      <CardHeader className="p-4 md:p-6">
        <div className="w-full">
          <h3 className="text-3xl font-bold text-white mb-2">
            {champion.name}{" "}
            <span
              className={
                comfortSymbol === "★" ? "text-primary" : "text-slate-400"
              }
            >
              {comfortSymbol}
            </span>
          </h3>
          <p className="text-sm text-foreground/70">{champion.role}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-8 p-4 md:p-6">
        <div>
          <h4 className="text-2xl font-bold text-primary mb-4">How to Play</h4>
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

        <Divider />

        <div>
          <h4 className="text-2xl font-bold text-primary mb-4">Build Paths</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {champion.builds.map((build) => (
              <BuildPath key={build.name} build={build} />
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
