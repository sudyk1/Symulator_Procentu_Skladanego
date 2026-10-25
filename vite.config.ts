import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Względne ścieżki, żeby strona działała pod /Symulator_Procentu_Skladanego/ na GitHub Pages
  base: './',
  test: {
    include: ['src/**/*.test.ts'],
  },
});
