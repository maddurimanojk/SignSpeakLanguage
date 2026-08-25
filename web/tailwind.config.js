/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#151D30',
        surfaceCard: '#1E293B',
        surfaceBorder: '#334155',
        primary: '#4F46E5', // Indigo
        primaryHover: '#4338CA',
        secondary: '#06B6D4', // Cyan
        accent: '#10B981', // Emerald
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
