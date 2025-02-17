import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss(),
    skeleton({
      themes: {
        preset: [
          {
            name: 'modern',
            enhancements: true,
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    fs: {
      allow: ['.']
    }
  },
  optimizeDeps: {
    include: ['@skeletonlabs/skeleton', 'idb-keyval', 'date-fns', 'lucide-svelte'],
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