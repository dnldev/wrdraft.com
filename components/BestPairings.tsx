// in /components/BestPairings.tsx
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { LucideIcon } from "./LucideIcon";
import { SynergyTierList } from "./SynergyTierList";

export function BestPairings() {
  return (
    <div className="space-y-12">
      <Card className="p-0">
        <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6 bg-card/50">
          <LucideIcon name="Sparkles" className="text-amber-400" />
          <h2 className="text-3xl font-bold text-amber-400 text-center">
            Featured Synergies
          </h2>
        </CardHeader>
        <CardBody className="p-4 md:p-6 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              S+ Tier: Lane Dominators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-l-4 border-amber-400">
                <h4 className="text-xl font-semibold">
                  <span className="champ-adc">Jinx ★</span> +{" "}
                  <span className="champ-supp">Milio ★</span>
                </h4>
                <p className="text-sm text-foreground/80">
                  Peak hyper-carry protection. Milio gives Jinx the range, peel,
                  and CC cleanse she needs to dominate teamfights.
                </p>
              </Card>
              <Card className="p-4 border-l-4 border-amber-400">
                <h4 className="text-xl font-semibold">
                  <span className="champ-adc">Lucian ☆</span> +{" "}
                  <span className="champ-supp">Nami ★</span>
                </h4>
                <p className="text-sm text-foreground/80">
                  Classic aggressive lane. Nami's E empowers Lucian's passive
                  for oppressive burst trades.
                </p>
              </Card>
              <Card className="p-4 border-l-4 border-amber-400">
                <h4 className="text-xl font-semibold">
                  <span className="champ-adc">Caitlyn</span> +{" "}
                  <span className="champ-supp">Morgana</span>
                </h4>
                <p className="text-sm text-foreground/80">
                  The 3-second root from Morgana's Q guarantees a Caitlyn trap,
                  leading to an inescapable CC chain.
                </p>
              </Card>
              <Card className="p-4 border-l-4 border-amber-400">
                <h4 className="text-xl font-semibold">
                  <span className="champ-adc">Lucian ☆</span> +{" "}
                  <span className="champ-supp">Braum</span>
                </h4>
                <p className="text-sm text-foreground/80">
                  Instant stun setup. Braum's Q plus a single Lucian passive
                  proc instantly activates Concussive Blows.
                </p>
              </Card>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              S Tier: Powerful Combos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border-l-4 border-slate-400">
                <h4 className="text-xl font-semibold">
                  <span className="champ-supp">Leona ☆</span> +{" "}
                  <span className="champ-adc">Miss Fortune</span>
                </h4>
                <p className="text-sm text-foreground/80">
                  The wombo-combo. Leona's Solar Flare holds multiple enemies in
                  place for a devastating Bullet Time.
                </p>
              </Card>
              <Card className="p-4 border-l-4 border-slate-400">
                <h4 className="text-xl font-semibold">
                  <span className="champ-supp">Leona ☆</span> +{" "}
                  <span className="champ-adc">Kai'Sa</span>
                </h4>
                <p className="text-sm text-foreground/80">
                  Leona's CC stacks Kai'Sa's passive instantly, leading to
                  insane burst damage when Kai'Sa follows up.
                </p>
              </Card>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="p-0">
        <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6 bg-card/50">
          <LucideIcon name="ListChecks" className="text-green-400" />
          <h2 className="text-3xl font-bold text-green-400 text-center">
            Complete Synergy Matrix
          </h2>
        </CardHeader>
        <Divider />
        <CardBody className="p-4 md:p-6">
          <SynergyTierList />
        </CardBody>
      </Card>
    </div>
  );
}
