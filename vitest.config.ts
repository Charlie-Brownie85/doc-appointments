import { fileURLToPath } from 'node:url';

import {
  mergeConfig,
  defineConfig,
  configDefaults,
  coverageConfigDefaults,
} from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        reportsDirectory: 'coverage',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          ...coverageConfigDefaults.exclude,
          '**/node_modules/**',
          'dist/**',
          'coverage/**',
          '**/locales/**',
          '**/i18n/**',
          'src/main.ts',
          '**/*.d.ts',
          '**/config/**',
          '**/declarations/**',
          '**/api.ts',
          '**/routes.ts',
          '**/*.config.*',
          '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
          '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
          '**/*{.,-}preset.{js,cjs,mjs,ts,tsx,jsx}',
          'src/stores/index.ts',
          'src/router/**',
          'src/App.vue',
        ],
      },
      globals: true,
      environment: 'jsdom',
      setupFiles: ['vitest.init.ts'],
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
);
