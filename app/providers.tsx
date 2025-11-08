"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="spirit-blossom"
      themes={[
        "hextech-arcane",
        "demacian-justice",
        "spirit-blossom",
        "freljordian-ice",
        "shuriman-sun",
        "celestial-peak",
      ]}
    >
      <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
    </ThemeProvider>
  );
}
