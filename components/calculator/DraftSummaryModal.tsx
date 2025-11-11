"use client";

import {
  Avatar,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
} from "@heroui/react";
import React from "react";

import { Champion } from "@/data/championData";
import { DraftSummary } from "@/hooks/useMatchupCalculator";

interface DraftSummaryModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly summary: DraftSummary | null;
  readonly championMap: Map<string, Champion>;
}

const getScoreColor = (score: number) => {
  if (score > 0) return "success";
  if (score < 0) return "danger";
  return "default";
};

/**
 * A modal that displays a detailed breakdown and estimated win chance for the complete 2v2 lane matchup.
 * It appears automatically when all four champion selections are filled.
 */
export function DraftSummaryModal({
  isOpen,
  onClose,
  summary,
  championMap,
}: DraftSummaryModalProps) {
  if (!summary) return null;

  const { overallScore, winChance, breakdown, selections } = summary;

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
                  className={`text-xl font-bold ${
                    winChance >= 50 ? "text-success" : "text-danger"
                  }`}
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

            <div>
              <p className="text-sm font-semibold text-white mb-2">Breakdown</p>
              <div className="space-y-1 text-sm">
                {breakdown.map((item) => (
                  <div
                    key={item.reason}
                    className="flex justify-between items-center p-2 bg-content2 rounded-md"
                  >
                    <span className="text-foreground/80">{item.reason}</span>
                    <Chip size="sm" color={getScoreColor(item.value)}>
                      {item.value > 0 ? `+${item.value}` : item.value}
                    </Chip>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
