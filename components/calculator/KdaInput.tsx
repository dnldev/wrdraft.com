"use client";

import React from "react";

import { KDA } from "@/types/draft";

import { NumberInput } from "./NumberInput";

interface KdaInputProps {
  readonly value: KDA;
  readonly onChange: (newValue: KDA) => void;
}

/**
 * A component with three separate number stepper inputs for Kills, Deaths, and Assists,
 * providing a touch-friendly experience for mobile users.
 */
export const KdaInput: React.FC<KdaInputProps> = ({ value, onChange }) => {
  const handlePartChange = (part: keyof KDA, val: number) => {
    onChange({ ...value, [part]: val });
  };

  return (
    <div className="flex gap-2">
      <NumberInput
        label="K"
        aria-label="Kills"
        value={value.k}
        onChange={(v) => handlePartChange("k", v)}
      />
      <NumberInput
        label="D"
        aria-label="Deaths"
        value={value.d}
        onChange={(v) => handlePartChange("d", v)}
      />
      <NumberInput
        label="A"
        aria-label="Assists"
        value={value.a}
        onChange={(v) => handlePartChange("a", v)}
      />
    </div>
  );
};
