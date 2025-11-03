import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { LucideIcon } from "./LucideIcon";

const tierListData = {
  adc: {
    "S+": ["Lucian"],
    S: ["Xayah", "Corki", "Miss Fortune", "Jhin"],
    A: [
      "Jinx",
      "Kai'Sa",
      "Vayne",
      "Samira",
      "Sivir",
      "Caitlyn",
      "Varus",
      "Ezreal",
      "Ashe",
    ],
    B: ["Twitch", "Tristana", "Draven", "Zeri"],
    C: ["Kalista", "Nilah"],
  },
  support: {
    "S+": ["Braum", "Nami", "Zilean"],
    S: [
      "Karma",
      "Lulu",
      "Maokai",
      "Nautilus",
      "Rakan",
      "Pyke",
      "Bard",
      "Milio",
      "Senna",
      "Alistar",
      "Leona",
    ],
    A: [
      "Yuumi",
      "Zyra",
      "Sona",
      "Janna",
      "Seraphine",
      "Soraka",
      "Ornn",
      "Galio",
      "Blitzcrank",
    ],
    B: ["Morgana", "Singed", "Amumu", "Nunu & Willump", "Jarvan IV", "Thresh"],
    C: ["Swain", "Brand", "Lux"],
  },
};

const tierColors: {
  [key: string]: "success" | "primary" | "warning" | "default" | "danger";
} = {
  "S+": "success",
  S: "primary",
  A: "warning",
  B: "default",
  C: "danger",
};

export function TierList() {
  return (
    <Card className="p-0">
      <CardHeader className="flex items-center justify-center gap-3 p-4 md:p-6">
        <LucideIcon name="BarChartBig" className="text-primary" />
        <h2 className="text-3xl font-bold text-primary text-center">
          Meta Tier List (Patch 6.3b)
        </h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            Dragon Lane (ADC)
          </h3>
          <div className="space-y-4">
            {Object.entries(tierListData.adc).map(([tier, champions]) => (
              <div key={`adc-${tier}`} className="flex items-start gap-3">
                <Chip
                  color={tierColors[tier]}
                  variant="shadow"
                  className="font-bold w-12 shrink-0"
                >
                  {tier}
                </Chip>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
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
            {Object.entries(tierListData.support).map(([tier, champions]) => (
              <div key={`supp-${tier}`} className="flex items-start gap-3">
                <Chip
                  color={tierColors[tier]}
                  variant="shadow"
                  className="font-bold w-12 shrink-0"
                >
                  {tier}
                </Chip>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
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
