"use client";

import {
  Avatar,
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
} from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";
import { DraftSummary } from "@/hooks/useMatchupCalculator";

interface DraftSummaryModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onOpenLogResult: () => void;
  readonly summary: DraftSummary | null;
  readonly championMap: Map<string, Champion>;
}

const getScoreColor = (score: number) => {
  if (score > 0) return "success";
  if (score < 0) return "danger";
  return "default";
};

const BreakdownRow: React.FC<{
  readonly label: string;
  readonly value: number;
}> = ({ label, value }) => (
  <div className="flex justify-between items-center p-2 bg-content2 rounded-md">
    <span className="text-foreground/80">{label}</span>
    <Chip size="sm" color={getScoreColor(value)}>
      {value > 0 ? `+${value}` : value}
    </Chip>
  </div>
);

/**
 * A modal that displays a detailed breakdown and estimated win chance for the 2v2 lane matchup.
 */
export function DraftSummaryModal({
  isOpen,
  onClose,
  onOpenLogResult,
  summary,
  championMap,
}: DraftSummaryModalProps) {
  let yourSynergy = 0;
  let enemySynergy = 0;
  let matchups: DraftSummary["breakdown"] = [];

  if (summary?.breakdown) {
    yourSynergy =
      summary.breakdown.find((b) => b.reason === "Your Team Synergy")?.value ??
      0;
    enemySynergy =
      summary.breakdown.find((b) => b.reason === "Enemy Team Synergy")?.value ??
      0;
    matchups = summary.breakdown.filter((b) => b.reason.includes("vs"));
  }

  if (!summary) return null;

  const { overallScore, winChance, selections } = summary;
  const alliedAdc = championMap.get(selections.alliedAdc ?? "");
  const alliedSupport = championMap.get(selections.alliedSupport ?? "");
  const enemyAdc = championMap.get(selections.enemyAdc ?? "");
  const enemySupport = championMap.get(selections.enemySupport ?? "");

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold">Draft Summary</h2>
          <p className="text-sm text-foreground/60">
            An analysis of the complete 2v2 matchup.
          </p>
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm font-semibold text-success mb-2">
                  YOUR TEAM
                </p>
                <div className="flex justify-center gap-2">
                  {alliedAdc && (
                    <Avatar src={alliedAdc.portraitUrl} size="lg" />
                  )}
                  {alliedSupport && (
                    <Avatar src={alliedSupport.portraitUrl} size="lg" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-danger mb-2">
                  ENEMY TEAM
                </p>
                <div className="flex justify-center gap-2">
                  {enemyAdc && <Avatar src={enemyAdc.portraitUrl} size="lg" />}
                  {enemySupport && (
                    <Avatar src={enemySupport.portraitUrl} size="lg" />
                  )}
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm uppercase font-bold text-primary">
                Overall Lane Score
              </p>
              <Chip
                color={getScoreColor(overallScore)}
                size="lg"
                variant="shadow"
                className="text-2xl font-bold"
              >
                {overallScore > 0 ? `+${overallScore}` : overallScore}
              </Chip>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-semibold text-white">
                  Estimated Win Chance
                </p>
                <p
                  className={`text-xl font-bold ${winChance >= 50 ? "text-success" : "text-danger"}`}
                >
                  {winChance}%
                </p>
              </div>
              <Progress
                value={winChance}
                color={winChance >= 50 ? "success" : "danger"}
                size="md"
              />
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white mb-2">
                  Synergy Analysis
                </p>
                <div className="space-y-1 text-sm">
                  <BreakdownRow label="Your Team Synergy" value={yourSynergy} />
                  <BreakdownRow
                    label="Enemy Team Synergy"
                    value={enemySynergy}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-2">
                  Lane Matchups
                </p>
                <div className="space-y-1 text-sm">
                  {matchups.map((item) => (
                    <BreakdownRow
                      key={item.reason}
                      label={item.reason}
                      value={item.value}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onOpenLogResult} fullWidth>
            Log Game Result
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
