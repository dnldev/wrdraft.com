import React from "react";

import { MemoizedTeamComps } from "@/components/views";
import { TeamComposition } from "@/data/teamCompsData";
import { logger } from "@/lib/logger";
import { getKvClient } from "@/lib/upstash";

const KEY_PREFIX = "WR:";

export default async function TeamCompsPage() {
  logger.info("TeamCompsPage: Fetching team comps data...");
  const kv = getKvClient();

  const teamCompsData = await kv.get<TeamComposition[]>(
    `${KEY_PREFIX}teamcomps`
  );
  const teamComps = teamCompsData || [];

  return <MemoizedTeamComps teamComps={teamComps} />;
}
