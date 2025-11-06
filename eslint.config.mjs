import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  // Base Next.js configs
  ...nextVitals,
  ...nextTs,

  // SonarJS plugin for bug detection and code smells
  {
    plugins: {
      sonarjs,
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
    },
  },

  // Unicorn for additional rules and best practices
  {
    plugins: {
      unicorn,
    },
    rules: {
      ...unicorn.configs.recommended.rules,
      // Disable rules that are too restrictive or conflict with Next.js/React patterns
      "unicorn/prevent-abbreviations": "off", // Allows common abbreviations like `props`, `ref`, `env`
      "unicorn/no-null": "off", // Null is idiomatic in React for empty renders
      "unicorn/filename-case": "off", // Next.js uses conventions like `[id]` which this rule dislikes
      "unicorn/no-useless-undefined": "off", // Can conflict with optional props
      "unicorn/prefer-module": "off", // Next.js config files etc. may use CJS
      "unicorn/prefer-top-level-await": "off", // Not always applicable or desired
    },
  },

  // Simple import sort for consistent import order
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // Prettier config must be last to override other formatting rules
  prettierConfig,

  // Global ignores
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "next-env.d.ts",
      "eslint.config.mjs",
      "postcss.config.mjs",
      "tailwind.config.ts",
      "next.config.mjs",
      "sonar-project.js", // Also ignore the new SonarCloud config file
    ],
  },
]);

export default eslintConfig;
