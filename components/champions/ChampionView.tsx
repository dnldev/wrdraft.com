"use client";

import { Card, CardBody, Tab, Tabs, Tooltip } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Champion } from "@/data/championData";

import { ChampionGuide } from "./ChampionGuide";

interface ChampionViewProps {
  adcs: Champion[];
  supports: Champion[];
}

export function ChampionView({ adcs, supports }: ChampionViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeRole = (searchParams.get("role") as "adc" | "support") || "adc";
  const selectedChampId = searchParams.get("champ") || adcs[0]?.id || "";

  const championData = useMemo(
    () => ({
      adc: adcs,
      support: supports,
    }),
    [adcs, supports]
  );

  const currentList =
    activeRole === "adc" ? championData.adc : championData.support;
  const allChampions = useMemo(
    () => [...championData.adc, ...championData.support],
    [championData]
  );

  const selectedChampion =
    allChampions.find((c) => c.id === selectedChampId) || currentList[0];

  const handleSelectChampion = useCallback(
    (champId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("champ", champId);
      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleTabChange = useCallback(
    (key: React.Key) => {
      const role = key as "adc" | "support";
      const params = new URLSearchParams(searchParams.toString());
      params.set("role", role);

      if (role === "adc" && championData.adc.length > 0) {
        params.set("champ", championData.adc[0].id);
      } else if (role === "support" && championData.support.length > 0) {
        params.set("champ", championData.support[0].id);
      }

      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [pathname, router, searchParams, championData]
  );

  const renderChampionGrid = (champions: Champion[]) => (
    <div className="p-6 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-4">
      {champions.map((champ, index) => {
        const isSelected = selectedChampion.id === champ.id;
        return (
          <Tooltip content={champ.name} key={champ.id} placement="bottom">
            <button onClick={() => handleSelectChampion(champ.id)}>
              <Image
                src={champ.portraitUrl}
                alt={`${champ.name} portrait`}
                width={64}
                height={64}
                priority={index < 12} // Preload the first 12 images for faster perceived load
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
          <ChampionGuide champion={selectedChampion} />
        </div>
      )}
    </div>
  );
}
