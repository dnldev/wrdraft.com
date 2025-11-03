// in /components/LucideIcon.tsx
"use client";
import { icons, LucideProps } from "lucide-react";

interface LucideIconProps extends LucideProps {
  name: keyof typeof icons;
}

export const LucideIcon = ({ name, ...props }: LucideIconProps) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    // Return a placeholder or null if the icon name is invalid
    console.error(`Icon not found: ${name}`);
    return null;
  }

  return <IconComponent {...props} />;
};
