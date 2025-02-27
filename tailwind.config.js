import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43',
        },
        background: '#FAFBFC',
        surface: '#FFFFFF',
      },
      fontFamily: {
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(16, 42, 67, 0.08)',
        'medium': '0 4px 6px rgba(16, 42, 67, 0.12)',
      },
    },
  },
  plugins: [
    forms,
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
} satisfies Config;