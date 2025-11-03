/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Path ini memberitahu Tailwind file mana yang harus dipindai
  ],
  theme: {
    extend: {
      fontFamily: {
        'moderniz': ['Moderniz', 'sans-serif'],
        'bauhaus': ['Bauhaus93', 'sans-serif'],
      },
      animation: {
        shadowFade: 'shadowFade 5s infinite ease-in-out',
        gradient: 'gradient 8s linear infinite',
      },
      keyframes: {
        shadowFade: {
          '0%, 100%': { filter: 'drop-shadow(-1px 6px 3px rgba(0, 255, 255, 0.5))' },
          '50%': { filter: 'drop-shadow(-1px 6px 3px rgba(0, 255, 255, 0.3))' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
