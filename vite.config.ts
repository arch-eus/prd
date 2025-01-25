import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    __VERCEL_GIT_COMMIT_SHA__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA),
    __VERCEL_GIT_COMMIT_REF__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_REF),
    __VERCEL_URL__: JSON.stringify(process.env.VERCEL_URL),
  },
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
