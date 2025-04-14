/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
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
  plugins: [],
}