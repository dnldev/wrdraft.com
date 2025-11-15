import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { MemoizedChampionView } from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";
import { calculateChampionStats } from "@/lib/stats";

export async function generateStaticParams() {
  return [{ role: "adc" }, { role: "support" }];
}

export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ readonly role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const roleTitle = role === "adc" ? "ADC" : "Support";
  return {
    title: `${roleTitle} Champions | Wild Rift Dragon Lane Playbook`,
    description: `Explore ${roleTitle} champions and their builds for Wild Rift.`,
  };
}

interface ChampionsRolePageProps {
  readonly params: Promise<{
    readonly role: string;
  }>;
}

export default async function ChampionsRolePage({
  params,
}: ChampionsRolePageProps) {
  const { role } = await params;

  // Validate role parameter
  if (role !== "adc" && role !== "support") {
    notFound();
  }

  const { adcs, supports, draftHistory } = await getPlaybookData();
  const championStats = calculateChampionStats(draftHistory);

  return (
    <MemoizedChampionView
      adcs={adcs}
      supports={supports}
      championStats={championStats}
      initialRole={role}
    />
  );
}
