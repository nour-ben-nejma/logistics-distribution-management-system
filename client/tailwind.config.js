/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          midnight: '#0F172A',
          gold: '#D4AF37',
          goldLight: '#F5E6BE',
          slate: '#1E293B',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(15, 23, 42, 0.1), 0 4px 15px -5px rgba(15, 23, 42, 0.05)',
        'gold': '0 10px 30px -10px rgba(212, 175, 55, 0.2)',
      },
      borderRadius: {
        'premium': '1.25rem',
      }
    },
  },
  plugins: [],
}