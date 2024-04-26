import { fileURLToPath, URL } from 'node:url';

import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  optimizeDeps: {
    include: ['tailwindcss'],
  },
  plugins: [
    vue(),
    svgLoader(),
    Components({
      dirs: ['src/components', 'src/layouts'],
      extensions: ['vue'],
      deep: true,
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    sourcemap: true,
  },
});
