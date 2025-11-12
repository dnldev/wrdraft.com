"use client";

import { Button, Tooltip } from "@heroui/react";
import React from "react";

import { LucideIcon } from "../core/LucideIcon";
import { ThemeSwitcher } from "../core/ThemeSwitcher";

interface FloatingActionsProps {
  readonly bansLocked: boolean;
  readonly viewMode: "default" | "logPrevious";
  readonly onResetBans: () => void;
}

/**
 * Renders the floating action buttons in the bottom corner of the calculator view,
 * such as the theme switcher and the reset bans button.
 */
export const FloatingActions: React.FC<FloatingActionsProps> = ({
  bansLocked,
  viewMode,
  onResetBans,
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:pl-72 z-40 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
        <ThemeSwitcher />
      </div>
      {bansLocked && viewMode === "default" && (
        <div className="flex flex-col-reverse sm:flex-row gap-2 pointer-events-auto">
          <Tooltip content="Re-open Ban Phase">
            <Button isIconOnly color="default" size="lg" onPress={onResetBans}>
              <LucideIcon name="RotateCcw" />
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
