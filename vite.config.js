import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/style/variables.scss" as *;
          @use "@/style/mixin.scss" as *;
        `,
      },
      postcss: {
        plugins: {
          autoprefixer: {},
          'postcss-pxtorem': {
            rootValue: 14,
            propList: ['*'],
          },
        },
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  // 配置 base 为相对路径，避免打包后资源路径错误
  base: './'
});
