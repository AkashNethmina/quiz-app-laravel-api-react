/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#ff8229',
          600: '#f56a07',
          700: '#e05c04', // darker shade for hover
        }
      }
    },
  },
  plugins: [],
}

