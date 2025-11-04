// FILE: components/MatchupCalculator.tsx
"use client";

import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Tab,
  Tabs,
} from "@heroui/react";
import React, { useMemo, useState } from "react";

import { Champion } from "@/data/championData";
import { FirstPick, FirstPickData } from "@/data/firstPickData";
import { calculateRecommendations, Recommendation } from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";

import { LucideIcon } from "./LucideIcon";

interface MatchupCalculatorProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  firstPicks: FirstPickData;
}

const tierColors: Record<string, "success" | "primary" | "warning" | "danger"> =
  {
    "S-Tier": "success",
    "A-Tier": "primary",
    "B-Tier": "warning",
    "C-Tier": "danger",
  };

const FirstPickCard: React.FC<{ pick: FirstPick; champion?: Champion }> = ({
  pick,
  champion,
}) => (
  <Card className="p-4">
    <CardHeader className="flex items-center justify-between gap-2 p-0 pb-2">
      <div className="flex items-center gap-3">
        {champion && (
          <Avatar src={champion.portraitUrl} alt={champion.name} size="lg" />
        )}
        <h4 className="text-lg font-bold">{pick.name}</h4>
      </div>
      <Chip color={tierColors[pick.rating]} variant="flat">
        {pick.rating}
      </Chip>
    </CardHeader>
    <CardBody className="p-0">
      <p className="text-sm text-foreground/70">{pick.reasoning}</p>
    </CardBody>
  </Card>
);
export function MatchupCalculator({
  adcs,
  supports,
  allChampions,
  synergyMatrix,
  counterMatrix,
  firstPicks,
}: MatchupCalculatorProps) {
  const [roleToCalculate, setRoleToCalculate] = useState<"adc" | "support">(
    "adc"
  );
  const [selectedAlliedAdc, setSelectedAlliedAdc] = useState<string | null>(
    null
  );
  const [selectedAlliedSupport, setSelectedAlliedSupport] = useState<
    string | null
  >(null);
  const [selectedEnemyAdc, setSelectedEnemyAdc] = useState<string | null>(null);
  const [selectedEnemySupport, setSelectedEnemySupport] = useState<
    string | null
  >(null);

  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const allAdcs = useMemo(
    () => allChampions.filter((c) => c.role.includes("ADC")),
    [allChampions]
  );
  const allSupports = useMemo(
    () => allChampions.filter((c) => c.role.includes("Support")),
    [allChampions]
  );

  const selectedChampions = useMemo(() => {
    const selections = [
      selectedAlliedAdc,
      selectedAlliedSupport,
      selectedEnemyAdc,
      selectedEnemySupport,
    ];
    return new Set(selections.filter(Boolean));
  }, [
    selectedAlliedAdc,
    selectedAlliedSupport,
    selectedEnemyAdc,
    selectedEnemySupport,
  ]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setResults(null);

    const championPool = roleToCalculate === "adc" ? adcs : supports;
    const recommendations = calculateRecommendations({
      roleToCalculate,
      championPool,
      selections: {
        alliedAdc: selectedAlliedAdc,
        alliedSupport: selectedAlliedSupport,
        enemyAdc: selectedEnemyAdc,
        enemySupport: selectedEnemySupport,
      },
      synergyMatrix,
      counterMatrix,
    });

    setTimeout(() => {
      setResults(recommendations);
      setIsCalculating(false);
    }, 300);
  };

  const isButtonDisabled = selectedChampions.size === 0;

  const championMap = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const champ of allChampions) {
      map.set(champ.name, champ);
    }
    return map;
  }, [allChampions]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex items-center gap-3">
          <LucideIcon name="ShieldCheck" className="text-success" />
          <h2 className="text-2xl font-bold text-success">Safe First Picks</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className="text-sm text-foreground/70 mb-4">
            If you&apos;re picking early in the draft with little information,
            these champions are generally safe and flexible. Click to expand.
          </p>
          <Accordion selectionMode="multiple">
            <AccordionItem
              key="adcs"
              aria-label="First Pick ADCs"
              title={<h3 className="text-xl font-semibold">ADCs</h3>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {firstPicks.adcs.map((pick) => (
                  <FirstPickCard
                    key={pick.name}
                    pick={pick}
                    champion={championMap.get(pick.name)}
                  />
                ))}
              </div>
            </AccordionItem>
            <AccordionItem
              key="supports"
              aria-label="First Pick Supports"
              title={<h3 className="text-xl font-semibold">Supports</h3>}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {firstPicks.supports.map((pick) => (
                  <FirstPickCard
                    key={pick.name}
                    pick={pick}
                    champion={championMap.get(pick.name)}
                  />
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>

      <Card className="p-0">
        <CardHeader className="flex flex-col items-center justify-center gap-3 p-4 md:p-6">
          <LucideIcon name="Calculator" className="text-primary" />
          <h2 className="text-3xl font-bold text-primary text-center">
            Matchup Calculator
          </h2>
          <p className="text-sm text-foreground/70 text-center max-w-2xl">
            Select the other champions in the lane to get a weighted
            recommendation for your pick.
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="p-4 md:p-6 space-y-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Calculate best pick for...
            </h3>
            <Tabs
              selectedKey={roleToCalculate}
              onSelectionChange={(key) => {
                setRoleToCalculate(key as "adc" | "support");
                setResults(null);
              }}
              color="primary"
              aria-label="Role to calculate"
            >
              <Tab key="adc" title="ADC" />
              <Tab key="support" title="Support" />
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-success">
                Your Team
              </h3>
              <Autocomplete
                label="Your ADC"
                items={adcs.filter(
                  (c) =>
                    c.name === selectedAlliedAdc ||
                    !selectedChampions.has(c.name)
                )}
                onSelectionChange={(key) => setSelectedAlliedAdc(key as string)}
                isDisabled={roleToCalculate === "adc"}
                placeholder="Select your ADC"
              >
                {(champ) => (
                  <AutocompleteItem key={champ.name} textValue={champ.name}>
                    {champ.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Autocomplete
                label="Your Support"
                items={supports.filter(
                  (c) =>
                    c.name === selectedAlliedSupport ||
                    !selectedChampions.has(c.name)
                )}
                onSelectionChange={(key) =>
                  setSelectedAlliedSupport(key as string)
                }
                isDisabled={roleToCalculate === "support"}
                placeholder="Select your Support"
              >
                {(champ) => (
                  <AutocompleteItem key={champ.name} textValue={champ.name}>
                    {champ.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-danger">
                Enemy Team
              </h3>
              <Autocomplete
                label="Enemy ADC"
                items={allAdcs.filter(
                  (c) =>
                    c.name === selectedEnemyAdc ||
                    !selectedChampions.has(c.name)
                )}
                onSelectionChange={(key) => setSelectedEnemyAdc(key as string)}
                placeholder="Select enemy ADC"
              >
                {(champ) => (
                  <AutocompleteItem key={champ.name} textValue={champ.name}>
                    {champ.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
              <Autocomplete
                label="Enemy Support"
                items={allSupports.filter(
                  (c) =>
                    c.name === selectedEnemySupport ||
                    !selectedChampions.has(c.name)
                )}
                onSelectionChange={(key) =>
                  setSelectedEnemySupport(key as string)
                }
                placeholder="Select enemy Support"
              >
                {(champ) => (
                  <AutocompleteItem key={champ.name} textValue={champ.name}>
                    {champ.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              color="primary"
              size="lg"
              className="font-bold w-full md:w-auto"
              onPress={handleCalculate}
              isLoading={isCalculating}
              isDisabled={isButtonDisabled}
            >
              Calculate Best Pick
            </Button>
          </div>
        </CardBody>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <h3 className="text-2xl font-bold text-white">Recommendations</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            {results.map(({ champion, score, breakdown }, index) => (
              <Card
                key={champion.id}
                className="p-4 bg-background/50 flex-row items-center gap-4"
              >
                <Avatar
                  src={champion.portraitUrl}
                  className="w-16 h-16"
                  alt={champion.name}
                />
                <div className="flex-grow">
                  <h4 className="text-xl font-bold text-white">
                    {index + 1}. {champion.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {breakdown.map((item, i) => (
                      <Chip
                        key={i}
                        size="sm"
                        color={item.value > 0 ? "success" : "danger"}
                        variant="flat"
                        startContent={
                          <LucideIcon
                            name={item.value > 0 ? "ThumbsUp" : "ThumbsDown"}
                            size={12}
                            className="mr-1"
                          />
                        }
                      >
                        {item.reason}: {item.value > 0 ? "+" : ""}
                        {item.value}
                      </Chip>
                    ))}
                  </div>
                </div>
                <Chip
                  size="lg"
                  color={
                    score > 2 ? "success" : score > 0 ? "warning" : "danger"
                  }
                  variant="shadow"
                  className="font-bold text-lg"
                >
                  Score: {score}
                </Chip>
              </Card>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
