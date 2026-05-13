import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        cream: {
          50: "#fdfaf5",
          100: "#faf6f0",
          200: "#f3ece1",
          300: "#e8dcc8",
        },
        ink: {
          400: "#8a7d6e",
          500: "#5e5347",
          600: "#3d362f",
          700: "#2a2520",
          800: "#1a1612",
          900: "#0e0b09",
        },
        terra: {
          50: "#fdf4ec",
          100: "#fbe6d3",
          400: "#e07a3e",
          500: "#c2410c",
          600: "#9a3412",
          700: "#7c2d12",
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
