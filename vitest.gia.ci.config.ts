import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env.local') });

export default defineConfig({
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'shared'),
      '@': resolve(__dirname, 'client/src'),
    },
  },
  test: {
    include: [
      // Solo tests de razonamiento arquitectónico (no dependen de motores-api)
      'server/arkiGia.test.ts',
    ],
    fileParallelism: false,
    sequence: { shuffle: false },
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
