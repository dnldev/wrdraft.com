// components/history/StatRow.tsx
"use client";

import React from "react";

interface StatRowProps {
  label: string;
  children: React.ReactNode;
}

export const StatRow: React.FC<StatRowProps> = ({ label, children }) => (
  <div className="flex justify-between items-center">
    <span className="text-foreground/70 font-semibold">{label}</span>
    {children}
  </div>
);
