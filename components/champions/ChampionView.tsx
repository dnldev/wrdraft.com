// components/champions/ChampionView.tsx
"use client";

import { Card, CardBody, Tab, Tabs, Tooltip } from "@heroui/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { Champion } from "@/data/championData";
import { ChampionStats } from "@/lib/stats";

import { ChampionGuide } from "./ChampionGuide";

interface ChampionViewProps {
  readonly adcs: Champion[];
  readonly supports: Champion[];
  readonly championStats: Map<string, ChampionStats>;
  readonly initialRole: "adc" | "support";
}

export function ChampionView({
  adcs,
  supports,
  championStats,
  initialRole,
}: ChampionViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeRole, setActiveRole] = useState<"adc" | "support">(initialRole);
  const selectedChampId = searchParams.get("champ");

  const championData = useMemo(
    () => ({
      adc: adcs,
      support: supports,
    }),
    [adcs, supports]
  );

  const currentList =
    activeRole === "adc" ? championData.adc : championData.support;

  // Ensure selected champion is from the current role
  const selectedChampion =
    currentList.find((c) => c.id === selectedChampId) || currentList[0];
  const selectedChampionStats = championStats.get(selectedChampion?.name || "");

  const handleSelectChampion = useCallback(
    (champId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("champ", champId);
      router.replace(`/champions/${activeRole}?${params.toString()}`, {
        scroll: false,
      });
    },
    [activeRole, router, searchParams]
  );

  const handleTabChange = useCallback(
    (key: React.Key) => {
      const role = key as "adc" | "support";
      setActiveRole(role);

      const newList = role === "adc" ? championData.adc : championData.support;
      const firstChampId = newList[0]?.id || "";

      const params = new URLSearchParams(searchParams.toString());
      params.set("champ", firstChampId);

      router.replace(`/champions/${role}?${params.toString()}`, {
        scroll: false,
      });
    },
    [championData, router, searchParams]
  );

  const renderChampionGrid = useCallback(
    (champions: Champion[]) => (
      <div className="p-6 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-4">
        {champions.map((champ, index) => {
          const isSelected = selectedChampion?.id === champ.id;
          return (
            <Tooltip content={champ.name} key={champ.id} placement="bottom">
              <button
                onClick={() => handleSelectChampion(champ.id)}
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
              </button>
            </Tooltip>
          );
        })}
      </div>
    ),
    [handleSelectChampion, selectedChampion]
  );

  return (
    <div className="w-full space-y-8">
      <Card>
        <Tabs
          aria-label="Champion Roles"
          color="primary"
          variant="underlined"
          selectedKey={activeRole}
          onSelectionChange={handleTabChange}
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-8 h-12",
            tabContent:
              "group-data-[selected=true]:text-primary text-lg font-semibold",
          }}
        >
          <Tab key="adc" title="ADCs">
            <CardBody className="p-0">
              {renderChampionGrid(championData.adc)}
            </CardBody>
          </Tab>
          <Tab key="support" title="Supports">
            <CardBody className="p-0">
              {renderChampionGrid(championData.support)}
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
