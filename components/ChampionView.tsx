// in /components/ChampionView.tsx
"use client";

import { Champion, champions } from "@/data/championData";
import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import { ChampionGuide } from "./ChampionGuide";

const adcChampions = champions.filter((c) => c.role.includes("ADC"));
const supportChampions = champions.filter((c) => c.role.includes("Support"));

export function ChampionView() {
  const [selectedChampion, setSelectedChampion] = useState<
    Champion | undefined
  >(adcChampions[0]);
  const [activeRole, setActiveRole] = useState<"adc" | "support">("adc");

  const handleSelectChampion = (champion: Champion) => {
    setSelectedChampion(champion);
  };

  const currentList = activeRole === "adc" ? adcChampions : supportChampions;

  const handleTabChange = (key: React.Key) => {
    const role = key as "adc" | "support";
    setActiveRole(role);

    if (role === "adc" && adcChampions.length > 0) {
      setSelectedChampion(adcChampions[0]);
    } else if (role === "support" && supportChampions.length > 0) {
      setSelectedChampion(supportChampions[0]);
    } else {
      setSelectedChampion(undefined);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
      {/* Champion Guide Content - Will be on the left for desktop */}
      <div className="order-2 md:order-1 md:col-span-9">
        {selectedChampion ? (
          <ChampionGuide champion={selectedChampion} />
        ) : (
          <Card>
            <CardBody>Select a champion to view their guide.</CardBody>
          </Card>
        )}
      </div>

      {/* Champion List Sidebar - Will be on top for mobile, right for desktop */}
      <div className="order-1 md:order-2 md:col-span-3">
        <Card className="p-0">
          <CardHeader className="p-0">
            <Tabs
              aria-label="Champion Roles"
              color="primary"
              variant="underlined"
              fullWidth
              selectedKey={activeRole}
              onSelectionChange={handleTabChange}
              classNames={{
                tabList: "w-full rounded-t-lg p-0",
                cursor: "w-full",
                base: "w-full",
                panel: "p-0",
              }}
            >
              <Tab key="adc" title="ADCs" />
              <Tab key="support" title="Supports" />
            </Tabs>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-2">
              {currentList.map((champ) => {
                const comfortSymbol = champ.comfort
                  ? champ.comfort.split(" ")[0]
                  : "";
                return (
                  <Button
                    key={champ.id}
                    variant={
                      selectedChampion?.id === champ.id ? "solid" : "flat"
                    }
                    color={
                      selectedChampion?.id === champ.id ? "primary" : "default"
                    }
                    className="justify-start h-12"
                    onClick={() => handleSelectChampion(champ)}
                  >
                    {champ.name} {comfortSymbol}
                  </Button>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
