// FILE: hooks/useMatchupCalculator.ts
import { useMemo, useState } from "react";

import { Champion } from "@/data/championData";
import { FirstPickData } from "@/data/firstPickData";
import { TierListData } from "@/data/tierListData";
import { calculateRecommendations, Recommendation } from "@/lib/calculator";
import { CounterMatrix, SynergyMatrix } from "@/lib/data-fetching";
import { createTierMap } from "@/lib/utils";

interface UseMatchupCalculatorProps {
  adcs: Champion[];
  supports: Champion[];
  allChampions: Champion[];
  synergyMatrix: SynergyMatrix;
  counterMatrix: CounterMatrix;
  firstPicks: FirstPickData;
  tierList: TierListData;
}

export function useMatchupCalculator({
  adcs,
  supports,
  allChampions,
  synergyMatrix,
  counterMatrix,
  firstPicks,
  tierList,
}: UseMatchupCalculatorProps) {
  const [roleToCalculate, setRoleToCalculate] = useState<"adc" | "support">(
    "adc"
  );
  const [selections, setSelections] = useState({
    alliedAdc: null as string | null,
    alliedSupport: null as string | null,
    enemyAdc: null as string | null,
    enemySupport: null as string | null,
  });

  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const championMap = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const champ of allChampions) {
      map.set(champ.name, champ);
    }
    return map;
  }, [allChampions]);

  const championTierMap = useMemo(() => createTierMap(tierList), [tierList]);

  const handleSelectionChange = (
    role: keyof typeof selections,
    name: string | null
  ) => {
    setSelections((prev) => ({ ...prev, [role]: name }));
    setResults(null);
  };

  const handleRoleChange = (role: "adc" | "support") => {
    setRoleToCalculate(role);
    setResults(null);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setResults(null);

    const championPool = roleToCalculate === "adc" ? adcs : supports;
    const recommendations = calculateRecommendations({
      roleToCalculate,
      championPool,
      selections,
      synergyMatrix,
      counterMatrix,
    });

    setTimeout(() => {
      setResults(recommendations);
      setIsCalculating(false);
    }, 300);
  };

  const isSelectionEmpty = Object.values(selections).every((s) => s === null);
  const currentFirstPicks =
    roleToCalculate === "adc" ? firstPicks.adcs : firstPicks.supports;

  return {
    roleToCalculate,
    selections,
    results,
    isCalculating,
    championMap,
    championTierMap,
    handleSelectionChange,
    handleRoleChange,
    handleCalculate,
    isSelectionEmpty,
    currentFirstPicks,
  };
}
