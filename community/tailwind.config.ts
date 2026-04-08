import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        community: {
          bg: "#121211",
          surface: "#1c1c1a",
          border: "#2e2e2a",
          muted: "#9c9890",
          text: "#f5f4f0",
        },
        accent: {
          DEFAULT: "#4a7c59",
          hover: "#3d6a4a",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
