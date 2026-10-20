import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // NxtWave CCBP 4.0 Design Tokens
        ccbp: {
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          blue: "var(--color-ccbp-blue)",
          green: "var(--color-accent-green)",
          amber: "var(--color-accent-amber)",
          navy: "var(--bg-navy)",
          tint: "var(--bg-accent-tint)",
          heading: "var(--text-heading)",
          body: "var(--text-body)",
          muted: "var(--text-muted)",
          border: "var(--border-light)",
        },
        // Semantic background tokens
        surface: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          dark: "var(--bg-dark)",
          navy: "var(--bg-navy)",
          tint: "var(--bg-accent-tint)",
        },
        // Existing support colors
        obsidian: {
          950: "#07090E",
          900: "#0D111A",
          850: "#121824",
          800: "#1A2233",
          700: "#27334D",
        },
        emerald: {
          400: "#44C654", // NxtWave CCBP vibrant green
          500: "#36A844",
          600: "#2B8736",
        },
        cyan: {
          400: "#0B69FF", // CCBP electric blue
          500: "#2563EB",
        },
        indigo: {
          400: "#3B82F6",
          500: "#2563EB",
          600: "#1D4ED8",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        button: "var(--shadow-button)",
        glow: "0 0 30px -5px rgba(11, 105, 255, 0.25)",
        "glow-green": "0 0 30px -5px rgba(68, 198, 84, 0.3)",
        glass: "0 8px 32px 0 rgba(24, 59, 86, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
