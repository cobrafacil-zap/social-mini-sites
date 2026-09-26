import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marca
        primary: {
          DEFAULT: "#145C4B",
          50: "#F2F7F5",
          100: "#E2EFE9",
          200: "#C5DED3",
          300: "#9BC4B3",
          400: "#6AA18C",
          500: "#3E8069",
          600: "#145C4B",
          700: "#0F4739",
          800: "#0B3229",
          900: "#07211B",
        },
        secondary: { DEFAULT: "#D9A441", 50: "#FDF8EC", 100: "#FAEED2" },

        // Neutros
        ink: { DEFAULT: "#0D1110", soft: "#2A302E", muted: "#6B7370" },
        paper: { DEFAULT: "#FAFAF8", alt: "#F4F4F1" },
        line: { DEFAULT: "#E8E8E3", soft: "#F0F0EC", strong: "#D6D6CF" },

        // Semânticos
        muted: "#787F7C",
        danger: { DEFAULT: "#B42318", 50: "#FEF3F2", 100: "#FDE4E1" },
        ok: { DEFAULT: "#0E6B4F", 50: "#ECFDF3", 100: "#D6F5E4" },
        warn: { DEFAULT: "#93650F", 50: "#FFFAEB", 100: "#FEF0C7" },
        okDot: "#12B76A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-fraunces)", "ui-serif", "Georgia"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(13 17 16 / 0.04)",
        sm: "0 1px 2px 0 rgb(13 17 16 / 0.05), 0 1px 3px 0 rgb(13 17 16 / 0.04)",
        card: "0 1px 2px 0 rgb(13 17 16 / 0.04), 0 4px 12px -2px rgb(13 17 16 / 0.05)",
        lift: "0 2px 4px 0 rgb(13 17 16 / 0.04), 0 8px 24px -4px rgb(13 17 16 / 0.08)",
        pop: "0 4px 8px -2px rgb(13 17 16 / 0.06), 0 16px 40px -8px rgb(13 17 16 / 0.12)",
        focus: "0 0 0 3px rgb(20 92 75 / 0.18)",
      },
      transitionDuration: { 150: "150ms", 180: "180ms", 200: "200ms" },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        rise: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        slideInLeft: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        grow: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
      },
      animation: {
        fadeIn: "fadeIn 180ms ease-out both",
        rise: "rise 200ms cubic-bezier(0.16, 1, 0.3, 1) both",
        slideDown: "slideDown 160ms cubic-bezier(0.16, 1, 0.3, 1) both",
        slideInLeft: "slideInLeft 200ms cubic-bezier(0.16, 1, 0.3, 1) both",
        scaleIn: "scaleIn 160ms cubic-bezier(0.16, 1, 0.3, 1) both",
        grow: "grow 400ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
