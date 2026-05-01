import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#030b1a",
          800: "#061224",
          700: "#0a1f3d",
          600: "#0d2b52",
        },
        cyber: {
          blue: "#00d4ff",
          green: "#00ff88",
          purple: "#a855f7",
          pink: "#f0abfc",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
        rajdhani: ["var(--font-rajdhani)", "Rajdhani", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0,212,255,0.4), 0 0 60px rgba(0,212,255,0.15)",
        "neon-green": "0 0 20px rgba(0,255,136,0.4), 0 0 60px rgba(0,255,136,0.15)",
        "neon-purple": "0 0 20px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.15)",
        "glass": "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "grid-scroll": "gridScroll 20s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        gridScroll: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
