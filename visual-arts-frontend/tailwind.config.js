/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: "#f97316", // Orange for buttons
        primaryHover: "#ea580c", // Slightly darker orange for hover
        secondary: "#4b5563", // Neutral for text
      },
    },
  },
  plugins: [],
};
