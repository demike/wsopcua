import { defineConfig } from 'vitest/config';
import path from 'path';

// Dedicated configuration for micro-benchmarks (`*.bench.ts`).
// Kept separate from the test config so benchmarks never run with the normal
// test suite and can use their own include pattern.
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.bench.ts'],
    exclude: ['node_modules', 'src/schema_parser/**', 'src/examples/**'],
    benchmark: {
      include: ['src/**/*.bench.ts'],
      exclude: ['node_modules', 'src/schema_parser/**', 'src/examples/**'],
      reporters: ['default'],
    },
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
