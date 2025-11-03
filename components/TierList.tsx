// in /components/TierList.tsx
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { LucideIcon } from "./LucideIcon";

const tierListData = {
  adc: [
    { tier: "S", champions: ["Ezreal", "Ashe", "Samira", "Varus"] },
    { tier: "A", champions: ["Nilah", "Jhin", "Lucian", "Kai'Sa", "Caitlyn"] },
    { tier: "B", champions: ["Miss Fortune", "Jinx", "Vayne"] },
  ],
  support: [
    { tier: "S", champions: ["Nautilus", "Alistar", "Janna", "Pyke"] },
    {
      tier: "A",
      champions: ["Ornn", "Morgana", "Lux", "Braum", "Thresh", "Rakan"],
    },
    { tier: "B", champions: ["Leona", "Soraka", "Lulu"] },
  ],
};

const tierColors: { [key: string]: "success" | "warning" | "default" } = {
  S: "success",
  A: "warning",
  B: "default",
};

export function TierList() {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
        <LucideIcon name="ChartBar" className="text-primary" />
        <h2 className="text-3xl font-bold text-primary text-center">
          Meta Tier List
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Dragon Lane (ADC)
          </h3>
          <div className="space-y-4">
            {tierListData.adc.map(({ tier, champions }) => (
              <div key={`adc-${tier}`} className="flex items-start gap-3">
                <Chip
                  color={tierColors[tier]}
                  variant="shadow"
                  className="font-bold"
                >
                  {tier}
                </Chip>
                <div className="flex flex-wrap gap-2">
                  {champions.map((name) => (
                    <span key={name} className="text-foreground/80">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Support</h3>
          <div className="space-y-4">
            {tierListData.support.map(({ tier, champions }) => (
              <div key={`supp-${tier}`} className="flex items-start gap-3">
                <Chip
                  color={tierColors[tier]}
                  variant="shadow"
                  className="font-bold"
                >
                  {tier}
                </Chip>
                <div className="flex flex-wrap gap-2">
                  {champions.map((name) => (
                    <span key={name} className="text-foreground/80">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
