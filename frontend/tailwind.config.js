/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: '#00AA6C',
        linen: '#faf1ed',
        primary: {
          50: '#e8fdf0',
          100: '#c1fad5',
          200: '#96f7b7',
          300: '#62f293',
          400: '#2ded6c',
          500: '#00eb5b',
          600: '#00ca4e',
          700: '#00a23e',
          800: '#007b2f',
          900: '#005420',
          950: '#002b11',
        }
      }
    },
  },
  plugins: [],
}
