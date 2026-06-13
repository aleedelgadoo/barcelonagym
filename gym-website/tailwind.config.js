/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          dark: '#1a1a1a',
          accent: '#ff6b35',
          light: '#f5f5f5',
        }
      }
    },
  },
  plugins: [],
}
