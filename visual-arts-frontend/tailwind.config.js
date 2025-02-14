/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
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
