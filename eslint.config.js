import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,vue}"], // 配置作用的文件类型
    plugins: { js, prettier }, // 启用 js 插件（@eslint/js）
    extends: ["js/recommended"],  // 继承 @eslint/js 推荐规则
    rules: { 'prettier/prettier': 'error' },
    languageOptions: { globals: globals.browser } // 设置浏览器全局变量
  },
  pluginVue.configs["flat/essential"], // Vue 插件提供的 Flat Config 规则（最基础的必需规则）
]);
