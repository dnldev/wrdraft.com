// in eslint.config.mjs

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // REMOVE THIS OBJECT FROM THE CONFIG ARRAY
  // {
  //   rules: {
  //     "@next/next/no-img-element": "off",
  //   },
  // },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/",
    "out/",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
