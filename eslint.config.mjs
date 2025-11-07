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
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-top-level-await": "off",
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
      "coverage/", // Ignore test coverage reports
      "scripts/", // Ignore utility scripts
      "next-env.d.ts",
      "eslint.config.mjs",
      "postcss.config.mjs",
      "tailwind.config.ts",
      "next.config.mjs",
      "sonar-project.js",
    ],
  },
]);

export default eslintConfig;
