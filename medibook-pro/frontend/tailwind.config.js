/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17324d",
        teal: {
          50: "#effcf9",
          100: "#d8f7f0",
          500: "#14b8a6",
          600: "#0f766e",
          700: "#115e59"
        }
      },
      spacing: {
        18: "4.5rem"
      },
      boxShadow: {
        soft: "0 20px 60px -28px rgba(23,50,77,.25)"
      }
    }
  },
  plugins: []
};
