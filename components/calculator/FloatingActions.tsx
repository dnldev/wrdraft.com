// components/calculator/FloatingActions.tsx
"use client";

import React from "react";

import { ThemeSwitcher } from "../core/ThemeSwitcher";

/**
 * Renders globally accessible floating action buttons, such as the theme switcher.
 */
export const FloatingActions: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:pl-72 z-40 flex items-center justify-between pointer-events-none">
      <div className="pointer-events-auto">
        <ThemeSwitcher />
      </div>
    </div>
  );
};
