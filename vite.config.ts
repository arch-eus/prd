import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['.']
    }
  },
  optimizeDeps: {
    include: ['@sveltejs/kit']
  },
  build: {
    target: 'esnext'
  }
});