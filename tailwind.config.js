/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: [
    "./index.html",
=======
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
>>>>>>> 149612e4d11739551c69e3fce2c79f5dbd2692e7
    "./src/**/*.{js,ts,jsx,tsx}", // Path ini memberitahu Tailwind file mana yang harus dipindai
  ],
  theme: {
    extend: {
<<<<<<< HEAD
=======
      colors: {
        'light-background': '#FFFFFF',
        'light-text': '#000000',
        'dark-background': '#060010',
        'dark-text': '#FFFFFF',
        'light-heading': '#00ffdc',
        'dark-heading': '#00ffdc',
        'light-shadow1': '#000754',
        'dark-shadow1': '#000754',
        'light-shadow2': '#4079ff',
        'dark-shadow2': '#4079ff',
        'light-shadow3': '#40ffaa',
        'dark-shadow3': '#40ffaa',
        'light-shadow4': '#00ffdc',
        'dark-shadow4': '#00ffdc',
        'light-navbar': '#FFFFFF',
        'dark-navbar': '#11142F',
      },
>>>>>>> 149612e4d11739551c69e3fce2c79f5dbd2692e7
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
