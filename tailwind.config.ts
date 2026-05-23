import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#2C5F2D",
          deep: "#23492A",
        },
        coral: "#F96167",
        paper: "#F4EFE6",
        sage: "#5A6C57",
        ink: "#0E1F2C",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        zh: ["var(--font-zh)", "var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.02em",
        wider2: "0.12em",
        widest2: "0.18em",
      },
      boxShadow: {
        thunk: "6px 6px 0 0 #0E1F2C",
        "thunk-lg": "8px 8px 0 0 #23492A",
      },
    },
  },
  plugins: [],
};

export default config;
