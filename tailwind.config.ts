import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        cream: {
          50: "#fafbfc",
          100: "#f4f5f7",
          200: "#eaecf0",
          300: "#e2e4e8",
        },
        ink: {
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f0f0f",
        },
        terra: {
          50: "#fff8eb",
          100: "#fef0c7",
          400: "#fbbf24",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
        },
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
};

export default config;
