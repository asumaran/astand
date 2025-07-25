import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/astand/', // GitHub Pages base path
  resolve: {
    alias: {
      '@astand': path.resolve(__dirname, '../src'),
    },
  },
});
