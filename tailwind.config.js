/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffe17c',
        charcoal: '#171e19',
        sage: '#b7c6c2',
        white: '#ffffff',
        black: '#000000',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        cabinet: ['Cabinet Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
