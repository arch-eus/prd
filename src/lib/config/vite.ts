// Vite configuration
export const viteConfig = {
  optimizeDeps: {
    include: ['@sveltejs/kit']
  },
  build: {
    target: 'esnext'
  }
};