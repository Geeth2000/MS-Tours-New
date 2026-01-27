/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#38BDF8", // Main brand light blue
          light: "#7DD3FC", // Soft highlights
          dark: "#0EA5E9", // CTA / hover
        },
        secondary: {
          DEFAULT: "#F8FAFC", // Page background
          dark: "#E5E7EB", // Borders / separators
        },
        accent: {
          DEFAULT: "#0F172A", // Headings / dark CTA
          light: "#1E293B",
        },
        glass: "rgba(255, 255, 255, 0.12)",
      },

      boxShadow: {
        soft: "0 10px 30px -10px rgba(56, 189, 248, 0.35)",
        card: "0 20px 40px -20px rgba(15, 23, 42, 0.35)",
        glow: "0 0 40px rgba(56, 189, 248, 0.6)",
      },

      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2rem",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
