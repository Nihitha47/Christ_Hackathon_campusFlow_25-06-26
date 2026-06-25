import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
    "../../packages/shared/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#07111f",
        surface: "#0d1728",
        surfaceAlt: "#111c31",
        accent: {
          DEFAULT: "#34d399",
          soft: "rgba(52, 211, 153, 0.18)"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(52, 211, 153, 0.14), 0 18px 48px rgba(0, 0, 0, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;