/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        court: {
          black: '#0a0a0a',
          dark: '#121212',
          gray: '#1e1e1e',
          gold: '#c9a227',
          crimson: '#8b0000',
          blue: '#1e3a5f',
          silver: '#c0c0c0',
        }
      },
      fontFamily: {
        serif: ['Noto Serif KR', 'Georgia', 'serif'],
        sans: ['Pretendard', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gavel': 'gavel 0.5s ease-in-out',
      },
      keyframes: {
        gavel: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-15deg)' },
        }
      }
    },
  },
  plugins: [],
}
