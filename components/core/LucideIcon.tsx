// in /components/LucideIcon.tsx
"use client";
import { icons, LucideProps } from "lucide-react";

import { logger } from "@/lib/development-logger";

interface LucideIconProps extends LucideProps {
  readonly name: keyof typeof icons;
}

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    // Log an error in development if an invalid icon name is provided.
    // This represents a developer error that should be addressed.
    logger.error("LucideIcon", `Icon not found: ${name}`);
    return null;
  }

  return <IconComponent {...props} />;
};
