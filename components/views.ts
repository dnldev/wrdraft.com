"use client";

import React from "react";

import { MatchupCalculatorContainer } from "@/components/calculator/MatchupCalculatorContainer";
import { ChampionView } from "@/components/champions/ChampionView";
import { DraftingInfo } from "@/components/drafting/DraftingInfo";
import { DraftHistory } from "@/components/history/DraftHistory";
import { BestPairings } from "@/components/pairings/BestPairings";
import { TeamComps } from "@/components/team-comps/TeamComps";

/**
 * This file exports memoized versions of all the main "view" components.
 * React.memo is a performance optimization that prevents a component from
 * re-rendering if its props have not changed.
 */

export const MemoizedDraftingInfo = React.memo(DraftingInfo);
export const MemoizedTeamComps = React.memo(TeamComps);
export const MemoizedBestPairings = React.memo(BestPairings);
export const MemoizedChampionView = React.memo(ChampionView);
export const MemoizedMatchupCalculator = React.memo(MatchupCalculatorContainer);
export const MemoizedDraftHistory = React.memo(DraftHistory);
