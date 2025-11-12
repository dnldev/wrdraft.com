"use client";

import { Avatar, Button, Card, CardBody, CardHeader } from "@heroui/react";
import React from "react";

import { LucideIcon } from "@/components/core/LucideIcon";
import { Champion } from "@/data/championData";
import { DraftSummary } from "@/hooks/useMatchupCalculator";

interface LogPreviousDraftProps {
  readonly draft: DraftSummary;
  readonly championMap: Map<string, Champion>;
  readonly onLog: () => void;
  readonly onDismiss: () => void;
}

/**
 * A prompt that appears when an un-logged draft is found in local storage,
 * allowing the user to either log the result or dismiss it.
 */
export const LogPreviousDraft: React.FC<LogPreviousDraftProps> = ({
  draft,
  championMap,
  onLog,
  onDismiss,
}) => {
  const alliedAdc = championMap.get(draft.selections.alliedAdc ?? "");
  const alliedSupport = championMap.get(draft.selections.alliedSupport ?? "");
  const enemyAdc = championMap.get(draft.selections.enemyAdc ?? "");
  const enemySupport = championMap.get(draft.selections.enemySupport ?? "");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center text-center w-full">
          <LucideIcon name="History" className="text-primary" />
          <h3 className="text-2xl font-bold text-white mt-2">
            Log Previous Game
          </h3>
          <p className="text-sm text-foreground/70">
            You have an un-logged draft. Would you like to log the result or
            dismiss it?
          </p>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-content2 rounded-lg">
          <div>
            <p className="text-sm font-semibold text-success mb-2">YOUR TEAM</p>
            <div className="flex items-center gap-2">
              {alliedAdc && <Avatar src={alliedAdc.portraitUrl} />}
              {alliedSupport && <Avatar src={alliedSupport.portraitUrl} />}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-danger mb-2">ENEMY TEAM</p>
            <div className="flex items-center gap-2">
              {enemyAdc && <Avatar src={enemyAdc.portraitUrl} />}
              {enemySupport && <Avatar src={enemySupport.portraitUrl} />}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button color="primary" onPress={onLog} fullWidth>
            <LucideIcon name="FilePlus" />
            Log Result
          </Button>
          <Button color="default" variant="ghost" onPress={onDismiss} fullWidth>
            <LucideIcon name="X" />
            Dismiss & Start New
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
