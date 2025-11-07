import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf6ff",
          100: "#cfe6ff",
          200: "#a0ccff",
          300: "#70b2ff",
          400: "#4098ff",
          500: "#1b7dff",
          600: "#0f60d6",
          700: "#0b49a3",
          800: "#073170",
          900: "#041b40",
        },
        slate: {
          950: "#0f172a",
        },
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        card: "0 10px 25px -15px rgba(15,23,42,0.35)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", opacity: "0.7" },
          "80%": { transform: "scale(1.5)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.5s infinite",
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
