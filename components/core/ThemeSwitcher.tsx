"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { LucideIcon } from "./LucideIcon";

const favoriteThemes = [
  { key: "hextech-arcane", label: "Hextech Arcane Gold ★" },
  { key: "demacian-justice", label: "Demacian Justice Blue ★" },
  { key: "spirit-blossom", label: "Spirit Blossom Pink ★" },
  { key: "freljordian-ice", label: "Freljordian Ice Turquoise ★" },
  { key: "shuriman-sun", label: "Shuriman Sun Gold ★" },
  { key: "celestial-peak", label: "Celestial Peak Blue ★" },
];

export const ThemeSwitcher = React.memo(function ThemeSwitcherComponent() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // This is a deliberate and necessary two-pass render to prevent hydration
    // errors with next-themes. The linter rule is correctly suppressed.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="ghost" isIconOnly>
          <LucideIcon name="Palette" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme Selection"
        selectionMode="single"
        selectedKeys={new Set([theme!])}
        onAction={(key) => setTheme(key as string)}
      >
        {favoriteThemes.map((t) => (
          <DropdownItem
            key={t.key}
            startContent={
              theme === t.key ? <LucideIcon name="Check" size={16} /> : null
            }
          >
            {t.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
});
