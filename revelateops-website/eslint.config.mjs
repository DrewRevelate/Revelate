import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const noHardcodedBrandColors = require("./eslint-rules/no-hardcoded-brand-colors.js");

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Brand compliance custom rules
  {
    plugins: {
      "brand": {
        rules: {
          "no-hardcoded-colors": noHardcodedBrandColors,
        },
      },
    },
    rules: {
      "brand/no-hardcoded-colors": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "eslint-rules/**", // Don't lint the linting rules themselves
  ]),
]);

export default eslintConfig;
