import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "380px",
      },
      colors: {
        pitch: {
          950: "#060a0d",
          900: "#0c1218",
          800: "#141c26",
          700: "#1e2a38",
        },
        accent: {
          DEFAULT: "#10b981",
          dim: "#059669",
          glow: "#34d399",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)",
        glow: "0 0 24px rgba(16, 185, 129, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
