import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    rules: {
      "no-unused-vars": "error", // ❌ 未使用变量直接拦
      "no-console": "warn", // ⚠️ 可选
      "@typescript-eslint/no-unused-vars": "error", // TS 版本（很关键）
      "@typescript-eslint/no-explicit-any": "warn", // ⚠️ 可选
      "vue/multi-word-component-names": "off", // 允许单词组件名（如 PermissionDemo.vue）
    },
  },
]);
