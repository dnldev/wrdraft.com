// in /components/ChampionGuide.tsx
import { Champion } from "@/data/championData";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BuildPath } from "./BuildPath";

export function ChampionGuide({ champion }: { champion: Champion }) {
  const comfortSymbol = champion.comfort ? champion.comfort.split(" ")[0] : "";

  return (
    <Card className="p-4 md:p-6 bg-transparent shadow-none">
      <CardHeader>
        <div className="w-full">
          <h3 className="text-3xl font-bold text-white mb-2">
            {champion.name}{" "}
            <span
              className={
                comfortSymbol === "★" ? "text-amber-400" : "text-slate-400"
              }
            >
              {comfortSymbol}
            </span>
          </h3>
          <p className="text-sm text-foreground/70">{champion.role}</p>
        </div>
      </CardHeader>
      <Divider className="my-4" />
      <CardBody className="space-y-8 pt-2">
        <div>
          <h4 className="text-xl font-bold text-white mb-3">How to Play</h4>
          <ul className="list-none space-y-4 text-foreground/80">
            {champion.howToPlay.map((item) => (
              <li key={item.tip}>
                <strong className="block text-white">{item.tip}</strong>
                <p className="text-sm">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-4">
            Matchups & Synergies
          </h4>
          <div className="space-y-4">
            <Card className="p-4 bg-background/50">
              <h5 className="font-bold text-sky-400 mb-2">Ideal Synergies</h5>
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
                <h5 className="font-bold text-green-400 mb-2">
                  Good Against (You Counter)
                </h5>
                <p className="text-foreground/80">
                  {champion.matchups.goodAgainst.join(", ")}
                </p>
              </Card>
              <Card className="p-4 bg-background/50">
                <h5 className="font-bold text-red-400 mb-2">
                  Difficult Matchups (You are Countered by)
                </h5>
                <p className="text-foreground/80">
                  {champion.matchups.badAgainst.join(", ")}
                </p>
              </Card>
            </div>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-3">Build Paths</h4>
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
