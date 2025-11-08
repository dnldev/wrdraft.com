import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        // All of your custom themes are now defined here
        "hextech-arcane": {
          extend: "dark", // Inherit from the base dark theme
          colors: {
            background: "#030712",
            foreground: "#E0E6F1",
            primary: { DEFAULT: "#D0A85C", foreground: "#030712" },
            focus: "#F0B95C",
            content1: "#0D111C",
            success: { DEFAULT: "#22D3EE", foreground: "#030712" },
            warning: { DEFAULT: "#FBBF24", foreground: "#030712" },
            danger: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
            default: { DEFAULT: "#0D111C", foreground: "#E0E6F1" },
          },
        },
        "demacian-justice": {
          extend: "dark",
          colors: {
            background: "#0F172A",
            foreground: "#E2E8F0",
            primary: { DEFAULT: "#F2C94C", foreground: "#0F172A" },
            focus: "#F2C94C",
            content1: "#1E293B",
            success: { DEFAULT: "#3B82F6", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#06B6D4", foreground: "#0F172A" },
            danger: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
            default: { DEFAULT: "#1E293B", foreground: "#E2E8F0" },
          },
        },
        "spirit-blossom": {
          extend: "dark",
          colors: {
            background: "#18122B",
            foreground: "#F1EFE6",
            primary: { DEFAULT: "#BE185D", foreground: "#FFFFFF" },
            focus: "#BE185D",
            content1: "#2B2240",
            success: { DEFAULT: "#2DD4BF", foreground: "#18122B" },
            warning: { DEFAULT: "#FB923C", foreground: "#18122B" },
            danger: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
            default: { DEFAULT: "#2B2240", foreground: "#F1EFE6" },
          },
        },
        "freljordian-ice": {
          extend: "dark",
          colors: {
            background: "#0E141B",
            foreground: "#E7F0FF",
            primary: { DEFAULT: "#63D6FF", foreground: "#0E141B" },
            focus: "#63D6FF",
            content1: "#1F2937",
            success: { DEFAULT: "#3B82F6", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#F59E0B", foreground: "#0E141B" },
            danger: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
            default: { DEFAULT: "#1F2937", foreground: "#E7F0FF" },
          },
        },
        "shuriman-sun": {
          extend: "dark",
          colors: {
            background: "#0F0E1B",
            foreground: "#F5F2E9",
            primary: { DEFAULT: "#F0C462", foreground: "#0F0E1B" },
            focus: "#F0C462",
            content1: "#1B192B",
            success: { DEFAULT: "#50E3C2", foreground: "#0F0E1B" },
            warning: { DEFAULT: "#FFA500", foreground: "#0F0E1B" },
            danger: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
            default: { DEFAULT: "#1B192B", foreground: "#F5F2E9" },
          },
        },
        "celestial-peak": {
          extend: "dark",
          colors: {
            background: "#050818",
            foreground: "#E8EBF7",
            primary: { DEFAULT: "#63B3ED", foreground: "#050818" },
            focus: "#63B3ED",
            content1: "#10142C",
            success: { DEFAULT: "#FFEB3B", foreground: "#050818" },
            warning: { DEFAULT: "#D1D5DB", foreground: "#050818" },
            danger: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
            default: { DEFAULT: "#10142C", foreground: "#E8EBF7" },
          },
        },
      },
    }),
  ],
};
export default config;
