"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import React from "react";

import { LucideIcon } from "../core/LucideIcon";

interface SynergyCardProps {
  adc: string;
  support: string;
  description: string;
  adcComfort?: "★" | "☆";
  supportComfort?: "★" | "☆";
  tierColor: "success" | "primary" | "warning";
}

const SynergyCard: React.FC<SynergyCardProps> = ({
  adc,
  support,
  description,
  adcComfort,
  supportComfort,
  tierColor,
}) => {
  const borderColorClass = {
    success: "border-success",
    primary: "border-primary",
    warning: "border-warning",
  }[tierColor];

  // Extracted logic to resolve nested template literals
  const adcComfortText = adcComfort ? ` ${adcComfort}` : "";
  const supportComfortText = supportComfort ? ` ${supportComfort}` : "";

  const adcText = `${adc}${adcComfortText}`;
  const supportText = `${support}${supportComfortText}`;

  return (
    <Card className={`p-4 border-l-4 ${borderColorClass}`}>
      <h4 className="text-xl font-semibold">
        <span className="champ-adc">{adcText}</span> +{" "}
        <span className="champ-supp">{supportText}</span>
      </h4>
      <p className="text-sm text-foreground/80 mt-1">{description}</p>
    </Card>
  );
};

export function FeaturedSynergies() {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
        <LucideIcon name="Sparkles" className="text-primary" />
        <h2 className="text-3xl font-bold text-primary text-center">
          Featured Synergies
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 md:p-6 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            S+ Tier: Comfort Combos (Your Best)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SynergyCard
              adc="Lucian"
              adcComfort="☆"
              support="Nami"
              supportComfort="★"
              description="Classic aggressive lane. Nami's E empowers Lucian's passive for oppressive burst trades."
              tierColor="success"
            />
            <SynergyCard
              adc="Jinx"
              adcComfort="★"
              support="Milio"
              supportComfort="★"
              description="Peak hyper-carry protection. Milio gives Jinx the range, peel, and CC cleanse she needs."
              tierColor="success"
            />
            <SynergyCard
              adc="Varus"
              adcComfort="★"
              support="Leona"
              supportComfort="☆"
              description="A very strong all-in 'chain-CC' lane. Leona's lockdown allows Varus to land his full combo."
              tierColor="success"
            />
            <SynergyCard
              adc="Lucian"
              adcComfort="☆"
              support="Braum"
              description="Instant stun setup. Braum's Q plus a single Lucian passive proc instantly activates Concussive Blows."
              tierColor="success"
            />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            S Tier: Powerful Combos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SynergyCard
              adc="Miss Fortune"
              support="Leona"
              supportComfort="☆"
              description="The wombo-combo. Leona's Solar Flare holds multiple enemies for a devastating Bullet Time."
              tierColor="primary"
            />
            <SynergyCard
              adc="Jinx"
              adcComfort="★"
              support="Thresh"
              description="The classic 'Trap in a Box' combo. Thresh's hook into Jinx's traps is a kill. Lantern saves her."
              tierColor="primary"
            />
            <SynergyCard
              adc="Caitlyn"
              support="Morgana"
              description="A 3-second root guarantees a Caitlyn trap, leading to an inescapable CC chain and massive damage."
              tierColor="primary"
            />
            <SynergyCard
              adc="Ashe"
              support="Leona"
              supportComfort="☆"
              description="Brutal chain-CC lane. Ashe's R into Leona's R (or vice-versa) means the target is stunned for 5+ seconds."
              tierColor="primary"
            />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            A Tier: Strong Synergies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SynergyCard
              adc="Jinx"
              adcComfort="★"
              support="Braum"
              description="The ultimate bodyguard. Braum blocks projectiles and provides disengage, allowing Jinx to scale safely."
              tierColor="warning"
            />
            <SynergyCard
              adc="Varus"
              adcComfort="★"
              support="Nami"
              supportComfort="★"
              description="Excellent poke and all-in potential. Nami E empowers Varus's autos, and her wave sets up his ult."
              tierColor="warning"
            />
            <SynergyCard
              adc="Jhin"
              support="Leona"
              supportComfort="☆"
              description="Leona's chain-CC is a perfect, long-duration setup for Jhin's W (root) and R (ult)."
              tierColor="warning"
            />
            <SynergyCard
              adc="Xayah"
              support="Rakan"
              description="The iconic duo. Rakan's engage perfectly sets up Xayah's feather recall root."
              tierColor="warning"
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
