import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 5173,
    host: true,
    fs: {
      allow: ['.']
    }
  },
  optimizeDeps: {
    include: ['idb-keyval', 'date-fns', 'lucide-svelte'],
    exclude: ['@sveltejs/kit']
  },
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
