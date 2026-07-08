/** @type {import('tailwindcss').Config} */
/*  Westermeier Restaurierung — Tailwind config (navy / gold, serif).
 *  Replaces client/tailwind.config.js. The old oxblood/pictet/terracotta
 *  palette was vestigial — the app is styled by CSS variables in
 *  restauro.css. These tokens mirror those variables so any Tailwind
 *  utility classes (bg-navy-900, text-gold-500, font-serif…) match the
 *  design system. Prefer the rst-* component classes; use these utilities
 *  only for one-off layout. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", '"Times New Roman"', "serif"],
        sans: ['"Hanken Grotesk"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"Spline Sans Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        // Neutrals (paper → ink)
        paper: {
          0: "#FFFFFF", 50: "#F5F5F5", 100: "#ECECEC", 200: "#E0E0E0", 300: "#CFCFCE",
        },
        stone: {
          400: "#ADADAB", 500: "#7E7E7C", 600: "#5B5B59", 700: "#3E3E3D", 800: "#323131",
        },
        ink: "#1B1B1A",
        // Navy — primary brand
        navy: {
          50: "#EDEEF4", 100: "#CDD3E3", 300: "#6E79A0", 500: "#223472",
          600: "#1A2A5C", 700: "#14224C", 900: "#0C1638", 950: "#070C22",
          DEFAULT: "#0C1638",
        },
        // Gilt gold — accent
        gold: {
          50: "#FBF4E0", 100: "#F7E7BC", 300: "#EACB79", 400: "#E3B54C",
          500: "#B98D2A", 700: "#8A6716", DEFAULT: "#E3B54C",
        },
        patina: { 100: "#DCE6DE", 400: "#5E8A6E", 500: "#47714F", 700: "#2E4C36", DEFAULT: "#47714F" },
        oxblood: { 100: "#EBD3CE", 500: "#8A392F", 700: "#5E251E", DEFAULT: "#8A392F" },
        bronze: { 400: "#A9885A", 500: "#8C6C42", DEFAULT: "#8C6C42" },
        semantic: {
          success: "#47714F",
          warning: "#B98D2A",
          danger: "#8A392F",
          info: "#223472",
        },
      },
      borderRadius: {
        rst: "10px",     // cards
        "rst-input": "4px",
        pill: "999px",   // buttons (brand signature)
      },
      boxShadow: {
        "rst-sm": "0 1px 3px rgba(12,22,56,0.08), 0 1px 2px rgba(12,22,56,0.05)",
        "rst-md": "0 4px 14px rgba(12,22,56,0.10), 0 2px 4px rgba(12,22,56,0.05)",
        "rst-lg": "0 12px 32px rgba(12,22,56,0.13), 0 4px 8px rgba(12,22,56,0.06)",
      },
      spacing: {
        "rst-sm": "12px", "rst-md": "16px", "rst-lg": "24px",
        "rst-xl": "32px", "rst-2xl": "48px", "rst-3xl": "64px",
      },
    },
  },
  plugins: [],
};
