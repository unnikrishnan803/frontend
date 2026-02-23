import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dusk: "#0f0a15",
        velvet: "#221229",
        blush: "#f8b8c9",
        ember: "#ff6c8f",
        wine: "#9f2f4f",
        mint: "#85e1c8",
      },
      fontFamily: {
        body: ["Outfit", "ui-sans-serif", "sans-serif"],
        heading: ["Playfair Display", "ui-serif", "serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(248,184,201,0.22), 0 0 35px rgba(255,108,143,0.25)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.03)", opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        rise: "rise 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
