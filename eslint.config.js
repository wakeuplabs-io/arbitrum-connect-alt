const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");
const globals = require("globals");

module.exports = [
  // Base JavaScript recommended rules
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/*.min.js",
      "**/package-lock.json",
      "**/drizzle/**",
      "**/.sst/**",
      "**/sst-env.d.ts",
    ],
  },

  // Configuration for TypeScript and JavaScript files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettier,
    },
    rules: {
      // TypeScript recommended rules
      ...typescript.configs.recommended.rules,

      // React recommended rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Custom rules from your original config
      "prettier/prettier": "error",
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

      // React JSX runtime (no need to import React in every file)
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // Disable some overly strict rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "react/prop-types": "off", // TypeScript handles this
      "no-undef": "off", // TypeScript handles this
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Specific configuration for Node.js config files
  {
    files: ["**/sst.config.ts", "**/vite.config.ts", "**/drizzle.config.ts", "**/eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },

  // Prettier config should be last to override conflicting rules
  prettierConfig,
];
