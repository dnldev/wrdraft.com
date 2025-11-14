// components/calculator/KdaPicker.tsx
"use client";

import Picker from "react-mobile-picker";

import { KDA } from "@/types/draft";

interface KdaPickerProps {
  readonly value: KDA;
  readonly onChange: (newValue: KDA) => void;
}

const numberRange = Array.from({ length: 51 }, (_, i) => i); // 0-50

/**
 * A mobile-friendly picker wheel for KDA input.
 */
export function KdaPicker({ value, onChange }: KdaPickerProps) {
  const pickerValue = { kills: value.k, deaths: value.d, assists: value.a };

  const handleChange = (
    newValue: Record<"kills" | "deaths" | "assists", number>
  ) => {
    onChange({
      k: newValue.kills,
      d: newValue.deaths,
      a: newValue.assists,
      rating: value.rating, // Preserve existing rating
    });
  };

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[36px] border-y-2 border-divider pointer-events-none" />
      <div className="flex justify-around px-4 pb-2">
        <span className="w-1/3 text-center font-semibold text-foreground/80">
          Kills
        </span>
        <span className="w-1/3 text-center font-semibold text-foreground/80">
          Deaths
        </span>
        <span className="w-1/3 text-center font-semibold text-foreground/80">
          Assists
        </span>
      </div>
      <Picker
        value={pickerValue}
        onChange={handleChange}
        height={180}
        itemHeight={36}
        wheelMode="natural"
      >
        <Picker.Column name="kills">
          {numberRange.map((option) => (
            <Picker.Item key={option} value={option}>
              {({ selected }) => (
                <div
                  className={`transition-colors text-lg ${selected ? "text-primary font-bold" : "text-foreground/70"}`}
                >
                  {option}
                </div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="deaths">
          {numberRange.map((option) => (
            <Picker.Item key={option} value={option}>
              {({ selected }) => (
                <div
                  className={`transition-colors text-lg ${selected ? "text-primary font-bold" : "text-foreground/70"}`}
                >
                  {option}
                </div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>
        <Picker.Column name="assists">
          {numberRange.map((option) => (
            <Picker.Item key={option} value={option}>
              {({ selected }) => (
                <div
                  className={`transition-colors text-lg ${selected ? "text-primary font-bold" : "text-foreground/70"}`}
                >
                  {option}
                </div>
              )}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  );
}
