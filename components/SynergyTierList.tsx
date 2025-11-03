// in /components/SynergyTierList.tsx
"use client";

import { Synergy, synergyData } from "@/data/synergyData";
import { Accordion, AccordionItem, Card, Chip } from "@heroui/react";

const ratingMap: Record<
  Synergy["rating"],
  { tier: string; color: "success" | "warning" | "default" | "danger" }
> = {
  Excellent: { tier: "S", color: "success" },
  Good: { tier: "A", color: "warning" },
  Neutral: { tier: "B", color: "default" },
  Poor: { tier: "C", color: "danger" },
};

const synergiesByAdc = synergyData.reduce((acc, current) => {
  if (!acc[current.adc]) {
    acc[current.adc] = [];
  }
  acc[current.adc].push(current);
  return acc;
}, {} as Record<string, Synergy[]>);

for (const adc in synergiesByAdc) {
  synergiesByAdc[adc].sort((a, b) => {
    const order = { Excellent: 0, Good: 1, Neutral: 2, Poor: 3 };
    return order[a.rating] - order[b.rating];
  });
}

export function SynergyTierList() {
  return (
    <Accordion selectionMode="multiple" defaultExpandedKeys={["Varus", "Jinx"]}>
      {Object.entries(synergiesByAdc).map(([adc, synergies]) => (
        <AccordionItem
          key={adc}
          aria-label={adc}
          title={<h3 className="text-xl font-bold text-white">{adc}</h3>}
        >
          <div className="space-y-4">
            {synergies.map(({ support, rating, note }) => (
              <Card key={`${adc}-${support}`} className="p-4 bg-background/50">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{support}</h4>
                    <p className="text-sm text-foreground/70 mt-1">{note}</p>
                  </div>
                  <Chip
                    color={ratingMap[rating].color}
                    variant="shadow"
                    className="font-bold shrink-0"
                  >
                    {ratingMap[rating].tier} Tier
                  </Chip>
                </div>
              </Card>
            ))}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
