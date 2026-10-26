import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths, so the site works under /Symulator_Procentu_Skladanego/ on GitHub Pages
  base: './',
  build: {
    // Readable stack traces in production; the repository is public, so nothing is exposed
    sourcemap: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
