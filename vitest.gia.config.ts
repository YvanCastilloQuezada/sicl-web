import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar .env.local (JWT_SECRET, MOTORES_API_URL, etc.)
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
      'server/arkiGia.test.ts',
      'server/arkiGiaMotores.test.ts',
      'server/arkiGiaStructural.test.ts',
      'server/arkiGiaStructuralWorld.test.ts',
      'server/arkiGiaNsga2.test.ts',
    ],
    fileParallelism: false,
    sequence: {
      shuffle: false,
    },
    testTimeout: 120000,
    hookTimeout: 120000,
    env: {
      ...process.env,
    },
  },
});
