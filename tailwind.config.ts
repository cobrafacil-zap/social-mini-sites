import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Casa
        primary: { DEFAULT: "#145C4B" },
        secondary: { DEFAULT: "#D9A441" },
        ink: "#181A17",
        paper: "#F6F6F2",
        line: "#E7E6E1",
        muted: "#767671",
        danger: "#9C3B31",
        ok: "#0E6B4F",
        okDot: "#0E8F4F",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-fraunces)", "ui-serif", "Georgia"],
      },
    },
  },
  plugins: [],
};

export default config;