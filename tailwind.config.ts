// in tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // The path for HeroUI is now handled in globals.css via @source
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    // The HeroUI plugin is now handled in globals.css via @plugin
  ],
};
export default config;
