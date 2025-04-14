import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Task Manager',
        short_name: 'Tasks',
        description: 'A modern task management application with offline capabilities',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple touch icon',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,wasm}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: true,
        navigateFallback: '/',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
  server: {
    fs: {
      allow: ['.']
    },
    port: 5173, // Revert to standard port since React is gone
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
  },
  build: {
    target: 'esnext'
  },
  optimizeDeps: {
    exclude: ['@sveltejs/kit'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  }
});