import type { Metadata } from "next";
import React from "react";

import { MemoizedTeamComps } from "@/components/views";
import { getPlaybookData } from "@/lib/data-fetching";

export const metadata: Metadata = {
  title: "Team Compositions | Wild Rift Dragon Lane Playbook",
  description: "Discover the best team compositions for Wild Rift bot lane.",
};

export default async function TeamCompsPage() {
  const { teamComps } = await getPlaybookData();

  return <MemoizedTeamComps teamComps={teamComps} />;
}
