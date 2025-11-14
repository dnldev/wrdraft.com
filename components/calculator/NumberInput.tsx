// components/calculator/NumberInput.tsx
"use client";

import { Button, Input, InputProps } from "@heroui/react";
import React from "react";

import { LucideIcon } from "../core/LucideIcon";

interface NumberInputProps extends Omit<InputProps, "onChange" | "value"> {
  readonly value: number;
  readonly onChange: (newValue: number) => void;
  readonly min?: number;
  readonly max?: number;
}

/**
 * A custom number input component with stepper buttons (+/-) for easier
 * adjustments, especially on mobile devices.
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max,
  ...props
}) => {
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    if (typeof max === "number") {
      onChange(Math.min(max, value + 1));
    } else {
      onChange(value + 1);
    }
  };

  const handleChange = (val: string) => {
    const numValue = Number.parseInt(val, 10);
    if (!Number.isNaN(numValue)) {
      onChange(numValue);
    } else if (val === "") {
      onChange(0);
    }
  };

  return (
    <Input
      {...props}
      type="number"
      inputMode="numeric"
      value={String(value)}
      onValueChange={handleChange}
      startContent={
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleDecrement}
          aria-label="Decrement"
        >
          <LucideIcon name="Minus" size={16} />
        </Button>
      }
      endContent={
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleIncrement}
          aria-label="Increment"
        >
          <LucideIcon name="Plus" size={16} />
        </Button>
      }
      classNames={{
        input: "text-center",
      }}
    />
  );
};
