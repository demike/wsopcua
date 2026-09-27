import { defineConfig } from 'vitest/config';
import path from 'path';

// Unit tests for the OPC UA schema parser / code generator.
// Kept separate from the default suite: the generator is a node-only tool
// (it reads/writes files and bundles its own jsdom) and the default config
// excludes src/schema_parser.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/schema_parser/**/*.spec.ts'],
    exclude: ['node_modules'],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
