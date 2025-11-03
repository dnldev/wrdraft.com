import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages//*.{js,ts,jsx,tsx,mdx}",
    "./components//.{js,ts,jsx,tsx,mdx}",
    "./app/**/.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0A1428", // Deep navy blue
            foreground: "#C7D1D8", // Off-white for text
            primary: {
              DEFAULT: "#F0B95C", // Gold/Amber accent
              foreground: "#0A1428", // Dark text on gold buttons
            },
            focus: "#F0B95C",
            content1: "#101C36", // Slightly lighter navy for cards
            success: { DEFAULT: "#0AC8B9", foreground: "#0A1428" }, // Teal
            warning: { DEFAULT: "#F0B95C", foreground: "#0A1428" }, // Gold
            danger: { DEFAULT: "#E84057", foreground: "#FFFFFF" }, // Red
          },
        },
      },
    }),
  ],
};
export default config;
