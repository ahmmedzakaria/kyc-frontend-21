import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts']
  },
  resolve: {
    alias: {
      '@nexacore/api-common': resolve(__dirname, '../frontend-libs-21/api-common/src/public-api.ts'),
      '@nexacore/api-common/': `${resolve(__dirname, '../frontend-libs-21/api-common/src/lib')}/`,
      '@nexacore/auth': resolve(__dirname, '../frontend-libs-21/auth/src/public-api.ts'),
      '@nexacore/auth/': `${resolve(__dirname, '../frontend-libs-21/auth/src/lib')}/`,
      '@nexacore/layout': resolve(__dirname, '../frontend-libs-21/layout/src/public-api.ts'),
      '@nexacore/layout/': `${resolve(__dirname, '../frontend-libs-21/layout/src/lib')}/`,
      '@nexacore/shared': resolve(__dirname, '../frontend-libs-21/shared/src/public-api.ts'),
      '@nexacore/shared/': `${resolve(__dirname, '../frontend-libs-21/shared/src/lib')}/`,
      '@app-core/': `${resolve(__dirname, 'src/app/core')}/`
    }
  }
});
