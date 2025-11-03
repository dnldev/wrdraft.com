// in /components/ChampionView.tsx
"use client";

import { champions } from "@/data/championData";
import { Avatar, Card, CardBody, Tab, Tabs, Tooltip } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChampionGuide } from "./ChampionGuide";

const adcChampions = champions.filter((c) => c.role.includes("ADC"));
const supportChampions = champions.filter((c) => c.role.includes("Support"));

export function ChampionView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeRole = (searchParams.get("role") as "adc" | "support") || "adc";
  const selectedChampId =
    searchParams.get("champ") ||
    (activeRole === "adc" ? adcChampions[0]?.id : supportChampions[0]?.id) ||
    "";

  const currentList = activeRole === "adc" ? adcChampions : supportChampions;
  const selectedChampion =
    champions.find((c) => c.id === selectedChampId) || currentList[0];

  const handleTabChange = (key: React.Key) => {
    const newRole = key as "adc" | "support";
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", newRole);
    // When role changes, set champ to the first in the new list
    if (newRole === "adc" && adcChampions.length > 0) {
      params.set("champ", adcChampions[0].id);
    } else if (newRole === "support" && supportChampions.length > 0) {
      params.set("champ", supportChampions[0].id);
    }
    // Push both changes in a single URL update
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSelectChampion = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("champ", id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full space-y-8">
      <Card>
        <Tabs
          aria-label="Champion Roles"
          color="primary"
          variant="solid"
          radius="lg"
          selectedKey={activeRole}
          onSelectionChange={handleTabChange}
          classNames={{
            tabList: "bg-content1 p-1",
            cursor: "bg-card",
          }}
        >
          <Tab key="adc" title="ADCs">
            <Card>
              <CardBody className="p-0">
                <div className="p-4 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-4">
                  {adcChampions.map((champ) => {
                    const isSelected = selectedChampion?.id === champ.id;
                    return (
                      <Tooltip
                        content={champ.name}
                        key={champ.id}
                        placement="bottom"
                      >
                        <button onClick={() => handleSelectChampion(champ.id)}>
                          <Avatar
                            src={champ.portraitUrl}
                            alt={`${champ.name} portrait`}
                            className={`w-16 h-16 transition-all duration-300 transform hover:scale-110 ${
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
              </CardBody>
            </Card>
          </Tab>
          <Tab key="support" title="Supports">
            <Card>
              <CardBody className="p-0">
                <div className="p-4 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-4">
                  {supportChampions.map((champ) => {
                    const isSelected = selectedChampion?.id === champ.id;
                    return (
                      <Tooltip
                        content={champ.name}
                        key={champ.id}
                        placement="bottom"
                      >
                        <button onClick={() => handleSelectChampion(champ.id)}>
                          <Avatar
                            src={champ.portraitUrl}
                            alt={`${champ.name} portrait`}
                            className={`w-16 h-16 transition-all duration-300 transform hover:scale-110 ${
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
              </CardBody>
            </Card>
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
