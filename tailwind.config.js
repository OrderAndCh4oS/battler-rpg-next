/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#decba7",
        gold: "#d78f05",
        black: "#1b1c1c",
        blackAlt: "#1b2c2c"
      }
    },
  },
  plugins: [],
}
