import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'src/schema_parser/**', 'src/examples/**', '**/*.e2e-spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text'],
      exclude: [
        '**/*.d.ts',
        '**/*.spec.ts',
        '**/*.e2e-spec.ts',
        '**/generated/**',
        '**/tcp_transport/**',
        '**/constants/**',
        'node_modules/**',
        'src/schema_parser/**',
      ],
    },
    testTimeout: 10000,
    server: {
      deps: {
        inline: ['vitest'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
  publicDir: 'src',
});
