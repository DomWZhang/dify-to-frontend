import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

import path from 'path';

export default defineConfig(({ mode }) => {
  const useMock = mode === 'development' && process.env.VITE_USE_MOCK === 'true';

  return {
    server: {
      proxy: useMock
        ? {}
        : {
            '/ipmi-web-api': {
              target: 'https://apitest.mshasia.com/ipmi-web-api',
              changeOrigin: true,
              rewrite: path => path.replace(/^\/ipmi-web-api/, ''),
            },
          },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      vue(),

      // 自动引入 API（如 ref, reactive, computed...）
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
      }),

      // 自动引入 UI 组件
      Components({
        resolvers: [VantResolver({ importStyle: 'less' })],
        dts: 'src/components.d.ts',
      }),
    ],
    css: {
      // preprocessorOptions: {
      //   less: {
      //     // 全局注入：1. Normalize.css 无需在这里引入（入口 CSS 引入更直观）
      //     additionalData: `
      //     @import "vant/es/style/var.less"; // 引入 Vant 内置变量
      //     @import "@/style/variables.less"; // 引入自定义 Less 变量（后续创建）
      //   `,
      //     javascriptEnabled: true, // 允许 Less 中使用 JS 表达式（Vant 必需）
      //   },
      // },
    },
  };
});
