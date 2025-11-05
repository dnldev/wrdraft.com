import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    dark: {
      colors: {
        background: "#010815", // Deeper navy for more contrast
        foreground: "#C7D1D8",
        primary: {
          DEFAULT: "#F0B95C",
          foreground: "#0A1428",
        },
        focus: "#F0B95C",
        content1: "#0E1629", // Lighter navy for cards
        success: { DEFAULT: "#0AC8B9", foreground: "#0A1428" },
        warning: { DEFAULT: "#3b82f6", foreground: "#FFFFFF" },
        danger: { DEFAULT: "#E84057", foreground: "#FFFFFF" },
        default: {
          DEFAULT: "#0E1629", // Match new card color
          foreground: "#C7D1D8",
        },
      },
    },
  },
});
