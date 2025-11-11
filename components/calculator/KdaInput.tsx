"use client";

import { Input } from "@heroui/react";
import React from "react";

import { KDA } from "@/types/draft";

interface KdaInputProps {
  readonly value: KDA;
  readonly onChange: (newValue: KDA) => void;
}

/**
 * A component with three separate number inputs for Kills, Deaths, and Assists.
 */
export const KdaInput: React.FC<KdaInputProps> = ({ value, onChange }) => {
  const handlePartChange = (part: keyof KDA, val: string) => {
    const numValue = Number.parseInt(val, 10);
    if (!Number.isNaN(numValue) && numValue >= 0) {
      onChange({ ...value, [part]: numValue });
    } else if (val === "") {
      onChange({ ...value, [part]: 0 });
    }
  };

  return (
    <div className="flex gap-2">
      <Input
        type="number"
        label="K"
        aria-label="Kills"
        value={String(value.k)}
        onValueChange={(v) => handlePartChange("k", v)}
        min={0}
      />
      <Input
        type="number"
        label="D"
        aria-label="Deaths"
        value={String(value.d)}
        onValueChange={(v) => handlePartChange("d", v)}
        min={0}
      />
      <Input
        type="number"
        label="A"
        aria-label="Assists"
        value={String(value.a)}
        onValueChange={(v) => handlePartChange("a", v)}
        min={0}
      />
    </div>
  );
};
