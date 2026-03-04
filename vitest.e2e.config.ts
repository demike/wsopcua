import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import path from 'path';

export default defineConfig({
  esbuild: {
    target: 'es2022',
  },
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts', './vitest.e2e.browser.setup.ts'],
    include: ['src/**/*.e2e-spec.ts'],
    exclude: ['node_modules', 'src/schema_parser/**', 'src/examples/**'],
    fileParallelism: false,
    maxWorkers: 1,
    minWorkers: 1,
    hookTimeout: 30000,
    testTimeout: 30000,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
