import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: 'minimal',
  },
  preset: {
    maskable: {
      sizes: [512],
    },
    apple: {
      sizes: [180],
    },
    android: {
      sizes: [192, 512],
    },
    favicon: {
      sizes: [16, 32, 48],
    },
  },
  images: ['public/favicon.svg'],
});