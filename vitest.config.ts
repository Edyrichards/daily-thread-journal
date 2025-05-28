import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config'; // Ensure this path is correct

export default defineConfig({
  ...viteConfig, // Spread the existing Vite config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // if you need a setup file
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
  },
});
