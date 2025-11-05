import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: "0px",
      sm: "0.25rem", // 4px
      DEFAULT: "0.5rem", // 8px
      md: "0.5rem", // 8px
      lg: "0.75rem", // 12px
      full: "9999px",
    },
    extend: {},
  },
  darkMode: "class",
  plugins: [], // The heroui() plugin is REMOVED
};
export default config;
