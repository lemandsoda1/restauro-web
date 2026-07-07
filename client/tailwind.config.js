/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["Verdana", "Geneva", "sans-serif"],
      },
      colors: {
        oxblood: {
          DEFAULT: "#93645D",
          dark: "#804940",
          light: "#A68079",
          muted: "#B99B98",
          border: "#DFD2CF",
          bg: "#F2EDED",
          "bg-light": "#F8F5F4",
        },
        pictet: {
          text: "#3E3E3E",
          "text-secondary": "#5B5B5B",
          "text-muted": "#787878",
          "text-disabled": "#959595",
          "bg-white": "#FFFFFF",
          "bg-light": "#F7F7F7",
          "bg-warm": "#F5F3F3",
          eggshell: "#F7F4F1",
          border: "#CFCFCF",
          "border-dark": "#959595",
          dark: "#1F1F1F",
        },
        terracotta: { DEFAULT: "#BC5A1D", light: "#C6733F", bg: "#F8EFE8" },
        canard: { DEFAULT: "#2D5F69", light: "#4C7780", bg: "#EAEFF0" },
        violet: { DEFAULT: "#8D4C82", light: "#9E6795", bg: "#F4EDF3" },
        bordeaux: "#A04044",
        semantic: {
          error: "#D12A46",
          success: "#0F9451",
          warning: "#DB7600",
        },
      },
      borderRadius: {
        pictet: "3px",
      },
      spacing: {
        "pictet-sm": "12px",
        "pictet-md": "17px",
        "pictet-lg": "25px",
        "pictet-xl": "35px",
        "pictet-2xl": "45px",
        "pictet-3xl": "60px",
      },
    },
  },
  plugins: [],
};
