import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/energie_clicker/',
  plugins: [react()],
  server: {
    port: 5173
  }
});
