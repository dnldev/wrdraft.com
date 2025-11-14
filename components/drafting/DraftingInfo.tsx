// components/drafting/DraftingInfo.tsx
"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

import { TierListData } from "@/data/tierListData";
import { ChampionStats } from "@/lib/stats";

import { LucideIcon } from "../core/LucideIcon";
import { TierList } from "./TierList";

const mindsetTips = [
  {
    title: "Comfort > Counter",
    text: "A well-piloted Nami is always better than a poorly played Alistar.",
  },
  {
    title: "Identify Win Conditions",
    text: "Are you a 'Protect the Carry' comp, a 'Dive' comp, or a 'Poke' comp? Your draft must have a clear goal.",
  },
  {
    title: "Check Damage Profile",
    text: "If your team is all AD, you must pick an AP support or AP-building ADC.",
  },
  {
    title: "Pick Order Matters",
    text: "First-pick a safe champion. Last-pick to counter the enemy.",
  },
];

interface DraftingInfoProps {
  tierList: TierListData;
  championStats: Map<string, ChampionStats>;
}

export function DraftingInfo({ tierList, championStats }: DraftingInfoProps) {
  return (
    <div className="space-y-12">
      <TierList tierList={tierList} championStats={championStats} />
      <Card className="p-0">
        <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
          <LucideIcon name="Swords" className="text-danger" />
          <h2 className="text-3xl font-bold text-danger text-center">
            Drafting Strategy
          </h2>
        </CardHeader>
        <Divider />
        <CardBody className="p-4 md:p-6 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <LucideIcon name="BrainCircuit" className="text-primary" />
              The Drafting Mindset
            </h3>
            <div className="space-y-3">
              {mindsetTips.map((tip) => (
                <div key={tip.title} className="flex items-start gap-3">
                  <div className="pt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground/80">
                    <strong className="text-white">{tip.title}:</strong>{" "}
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-xl font-semibold text-white mb-3">
                Priority Bans
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong className="text-danger">Zed / Akali / Fizz:</strong>{" "}
                  Hyper-mobile assassins that delete your immobile ADCs.
                </li>
                <li>
                  <strong className="text-danger">Yuumi:</strong> Makes divers
                  like <strong className="text-yellow-300">Aatrox</strong>{" "}
                  unkillable.
                </li>
                <li>
                  <strong className="text-danger">
                    Blitzcrank / Nautilus / Thresh:
                  </strong>{" "}
                  Hook champions that punish squishy enchanters.
                </li>
                <li>
                  <strong className="text-danger">Draven:</strong> Ban him if
                  you want a safe, scaling lane.
                </li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="text-xl font-semibold text-white mb-3">
                Strategic Bans
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  To play <span className="champ-supp">Leona</span>, ban{" "}
                  <strong className="font-bold text-purple-400">Morgana</strong>
                  .
                </li>
                <li>
                  To play an engage comp, ban{" "}
                  <span className="champ-supp">Milio</span> or{" "}
                  <span className="champ-supp">Lulu</span>.
                </li>
                <li>
                  To play <span className="champ-adc">Miss Fortune</span>, ban{" "}
                  <span className="champ-supp">Braum</span> or{" "}
                  <strong className="font-bold text-yellow-300">Yasuo</strong>.
                </li>
              </ul>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
