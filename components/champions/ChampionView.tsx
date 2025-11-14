// components/champions/ChampionView.tsx
"use client";

import { Card, CardBody, Tab, Tabs, Tooltip } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { Champion } from "@/data/championData";
import { ChampionStats } from "@/lib/stats";

import { ChampionGuide } from "./ChampionGuide";

interface ChampionViewProps {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly championStats: Map<string, ChampionStats>;
}

export function ChampionView({
  adcs,
  supports,
  championStats,
}: ChampionViewProps) {
  const pathname = usePathname();

  const activeRole = pathname.includes("/support") ? "support" : "adc";
  const currentList = activeRole === "adc" ? adcs : supports;
  const selectedChampion = currentList[0] || adcs[0] || supports[0];
  const selectedChampionStats = championStats.get(selectedChampion?.name || "");

  const renderChampionGrid = useCallback(
    (champions: Champion[], role: "adc" | "support") => (
      <div className="p-6 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-4">
        {champions.map((champ, index) => {
          const isSelected = selectedChampion?.id === champ.id;
          return (
            <Tooltip content={champ.name} key={champ.id} placement="bottom">
              <Link
                href={`/champions/${role}`}
                scroll={false}
                aria-label={`Select ${champ.name}`}
              >
                <Image
                  src={champ.portraitUrl}
                  alt={`${champ.name} portrait`}
                  width={64}
                  height={64}
                  priority={index < 10}
                  className={`rounded-full object-cover w-16 h-16 transition-all duration-300 transform hover:scale-110 ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "grayscale hover:grayscale-0"
                  }`}
                />
              </Link>
            </Tooltip>
          );
        })}
      </div>
    ),
    [selectedChampion]
  );

  return (
    <div className="w-full space-y-8">
      <Card>
        <Tabs
          aria-label="Champion Roles"
          color="primary"
          variant="underlined"
          selectedKey={activeRole}
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-8 h-12",
            tabContent:
              "group-data-[selected=true]:text-primary text-lg font-semibold",
          }}
        >
          <Tab key="adc" title="ADCs" href="/champions/adc">
            <CardBody className="p-0">
              {renderChampionGrid(adcs, "adc")}
            </CardBody>
          </Tab>
          <Tab key="support" title="Supports" href="/champions/support">
            <CardBody className="p-0">
              {renderChampionGrid(supports, "support")}
            </CardBody>
          </Tab>
        </Tabs>
      </Card>

      {selectedChampion && (
        <div key={selectedChampion.id}>
          <ChampionGuide
            champion={selectedChampion}
            stats={selectedChampionStats}
          />
        </div>
      )}
    </div>
  );
}
