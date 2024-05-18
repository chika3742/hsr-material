// @ts-check

/** @type {import("./packages/nuxt/.nuxt/eslint.config.d.mjs").withNuxt} */
import withNuxt from "./packages/nuxt/.nuxt/eslint.config.mjs"

/** @type {import("eslint/rules").ESLintRules & import("./packages/nuxt/node_modules/@stylistic/eslint-plugin").RuleOptions} */
const commonRules = {
  "@stylistic/quotes": [
    "error",
    "double",
  ],
  "@stylistic/semi": [
    "error",
    "never",
  ],
  "@stylistic/comma-dangle": [
    "error",
    "always-multiline",
  ],
  "@stylistic/object-curly-spacing": ["error", "always"],
  "@stylistic/block-spacing": ["error", "always"],
  "space-before-function-paren": [
    "error",
    "never",
  ],
  "@stylistic/brace-style": ["error", "1tbs"],
  "no-useless-constructor": "off",
  "vue/multi-word-component-names": "off",
  "vue/no-v-html": "off",
  "import/named": "off",
  "no-use-before-define": "off",
  "@typescript-eslint/ban-ts-comment": "off",
  "no-void": [
    "error",
    {
      allowAsStatement: true,
    },
  ],
  "@typescript-eslint/no-floating-promises": [
    "error",
    {
      ignoreIIFE: true,
    },
  ],
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: {
        arguments: false,
      },
    },
  ],
  "@typescript-eslint/no-unsafe-member-access": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-namespace": "off",
}

export default withNuxt(
  {
    files: ["packages/nuxt/**"],
    rules: {
      "no-console": ["warn", { allow: ["error", "warn"] }],
    },
  },
  {
    ignores: [
      "packages/nuxt/.*/**",
      "packages/nuxt/**/generated/**",
      "packages/nuxt/py/**",
      "packages/nuxt/public/**",
    ],
  },
).overrideRules(commonRules)
