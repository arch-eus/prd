import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: ['.']
    }
  },
  optimizeDeps: {
    include: ['@sveltejs/kit'],
    exclude: ['@sveltejs/kit/hooks']
  },
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'svelte-kit': ['@sveltejs/kit']
        }
      }
    }
  }
});
