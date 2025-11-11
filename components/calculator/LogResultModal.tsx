"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  RadioGroup,
  Slider,
  Textarea,
} from "@heroui/react";
import React from "react";

import { KDA, LaneOutcome, MatchOutcome } from "@/types/draft";

import { LucideIcon } from "../core/LucideIcon";
import { KdaInput } from "./KdaInput";

export interface LogResultState {
  notes: string;
  matchOutcome: MatchOutcome;
  laneOutcome: LaneOutcome;
  gameLength: number;
  kdaAdc: KDA;
  kdaSupport: KDA;
  matchupFeel: number;
}

interface LogResultModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: () => void;
  readonly isSaving: boolean;
  readonly resultState: LogResultState;
  readonly onStateChange: <K extends keyof LogResultState>(
    key: K,
    value: LogResultState[K]
  ) => void;
}

/**
 * A modal form for logging the detailed results of a completed game.
 */
export function LogResultModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  resultState,
  onStateChange,
}: LogResultModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent>
        <ModalHeader className="flex-col gap-1 text-center">
          <h2 className="text-2xl font-bold">Log Game Result</h2>
          <p className="text-sm text-foreground/60">
            Provide details about the match outcome to improve future analysis.
          </p>
        </ModalHeader>
        <ModalBody className="pb-6">
          <div className="space-y-4">
            <Slider
              label="How effective did this lane matchup feel? (Required)"
              step={1}
              maxValue={5}
              minValue={1}
              value={resultState.matchupFeel}
              onChange={(v) => onStateChange("matchupFeel", v as number)}
            />
            <RadioGroup
              label="Game Outcome (Required)"
              orientation="horizontal"
              value={resultState.matchOutcome}
              onValueChange={(v) =>
                onStateChange("matchOutcome", v as MatchOutcome)
              }
              classNames={{ wrapper: "gap-4" }}
            >
              <Radio value="win" color="success">
                Win
              </Radio>
              <Radio value="loss" color="danger">
                Loss
              </Radio>
              <Radio value="remake">Remake</Radio>
            </RadioGroup>
            <RadioGroup
              label="Lane Outcome (Optional)"
              orientation="horizontal"
              value={resultState.laneOutcome}
              onValueChange={(v) =>
                onStateChange("laneOutcome", v as LaneOutcome)
              }
              classNames={{ wrapper: "gap-4" }}
            >
              <Radio value="win" color="success">
                Win
              </Radio>
              <Radio value="loss" color="danger">
                Loss
              </Radio>
              <Radio value="even">Even</Radio>
              <Radio value="unplayed">N/A</Radio>
            </RadioGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-foreground/80 block mb-1">
                  Your ADC KDA (Optional)
                </label>
                <KdaInput
                  value={resultState.kdaAdc}
                  onChange={(v) => onStateChange("kdaAdc", v)}
                />
              </div>
              <div>
                <label className="text-sm text-foreground/80 block mb-1">
                  Your Support KDA (Optional)
                </label>
                <KdaInput
                  value={resultState.kdaSupport}
                  onChange={(v) => onStateChange("kdaSupport", v)}
                />
              </div>
            </div>
            <Slider
              label="Game Length (Optional)"
              step={1}
              maxValue={60}
              minValue={10}
              value={resultState.gameLength}
              onChange={(v) => onStateChange("gameLength", v as number)}
              className="max-w-md"
              getValue={(v) => `${v} minutes`}
            />
            <Textarea
              label="Notes (Optional)"
              placeholder="Enter any notes about the draft, game outcome, etc."
              value={resultState.notes}
              onValueChange={(v) => onStateChange("notes", v)}
            />
            <Button
              color="primary"
              onPress={onSave}
              isLoading={isSaving}
              startContent={<LucideIcon name="Save" />}
              fullWidth
              className="font-bold"
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
