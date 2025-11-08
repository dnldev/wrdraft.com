import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    "hextech-arcane": {
      extend: "dark", // Inherit all base dark theme values
      colors: {
        background: "#030712",
        foreground: "#E0E6F1",
        content1: "#0D111C",
        primary: {
          DEFAULT: "#D0A85C",
          foreground: "#030712",
        },
        focus: "#F0B95C",
      },
    },
    "demacian-justice": {
      extend: "dark",
      colors: {
        background: "#0F172A",
        foreground: "#E2E8F0",
        content1: "#1E293B",
        primary: {
          DEFAULT: "#F2C94C",
          foreground: "#0F172A",
        },
        focus: "#F2C94C",
      },
    },
    "spirit-blossom": {
      extend: "dark",
      colors: {
        background: "#18122B",
        foreground: "#F1EFE6",
        content1: "#2B2240",
        primary: {
          DEFAULT: "#BE185D",
          foreground: "#FFFFFF",
        },
        focus: "#BE185D",
      },
    },
    "freljordian-ice": {
      extend: "dark",
      colors: {
        background: "#0E141B",
        foreground: "#E7F0FF",
        content1: "#1F2937",
        primary: {
          DEFAULT: "#63D6FF",
          foreground: "#0E141B",
        },
        focus: "#63D6FF",
      },
    },
    "shuriman-sun": {
      extend: "dark",
      colors: {
        background: "#0F0E1B",
        foreground: "#F5F2E9",
        content1: "#1B192B",
        primary: {
          DEFAULT: "#F0C462",
          foreground: "#0F0E1B",
        },
        focus: "#F0C462",
      },
    },
    "celestial-peak": {
      extend: "dark",
      colors: {
        background: "#050818",
        foreground: "#E8EBF7",
        content1: "#10142C",
        primary: {
          DEFAULT: "#63B3ED",
          foreground: "#050818",
        },
        focus: "#63B3ED",
      },
    },
  },
});
