// components/calculator/KdaInputGroup.tsx
"use client";

import { Checkbox, CheckboxGroup } from "@heroui/react";
import React from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { KDA, PlayerRating } from "@/types/draft";

import { KdaPicker } from "./KdaPicker";
import { NumberInput } from "./NumberInput";

interface KdaInputGroupProps {
  readonly value: KDA;
  readonly onChange: (newValue: KDA) => void;
}

/**
 * A responsive and unified component for inputting a player's KDA and performance rating.
 * It renders a touch-friendly picker wheel on mobile devices and numeric steppers on desktop.
 */
export const KdaInputGroup: React.FC<KdaInputGroupProps> = ({
  value,
  onChange,
}) => {
  const isMobile = useIsMobile();

  const handleRatingChange = (ratings: string[]) => {
    // The `rating` property is now an array of strings
    onChange({ ...value, rating: ratings as PlayerRating[] });
  };

  const handleKdaChange = (kda: Pick<KDA, "k" | "d" | "a">) => {
    onChange({ ...value, ...kda });
  };

  return (
    <div className="p-3 bg-content2 rounded-lg space-y-3">
      {isMobile ? (
        <KdaPicker value={value} onChange={onChange} />
      ) : (
        <div className="flex gap-2">
          <NumberInput
            label="K"
            aria-label="Kills"
            value={value.k}
            onChange={(k) => handleKdaChange({ ...value, k })}
          />
          <NumberInput
            label="D"
            aria-label="Deaths"
            value={value.d}
            onChange={(d) => handleKdaChange({ ...value, d })}
          />
          <NumberInput
            label="A"
            aria-label="Assists"
            value={value.a}
            onChange={(a) => handleKdaChange({ ...value, a })}
          />
        </div>
      )}

      <CheckboxGroup
        aria-label="Player Rating"
        orientation="horizontal"
        value={value.rating ?? []}
        onValueChange={handleRatingChange}
        classNames={{ wrapper: "gap-2 justify-center" }}
        size="sm"
      >
        <Checkbox value="MVP">MVP</Checkbox>
        <Checkbox value="SVP">SVP</Checkbox>
        <Checkbox value="S">S</Checkbox>
        <Checkbox value="A">A</Checkbox>
      </CheckboxGroup>
    </div>
  );
};
