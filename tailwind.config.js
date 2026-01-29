/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FE8C00",         // main brand color
        background: "#ffffff",      // default white background
        backgroundLight: "#FAFAFA", // light background
        dark: {
          100: "#181C2E",           // dark text / bg
        },
        gray: {
          100: "#878787",           // text gray
          200: "#B0B0B0",           // lighter gray
        },
        error: "#F14141",
        success: "#2F9B65",
      },
      fontFamily: {
        quicksand: "Quicksand-Regular",
        "quicksand-bold": "Quicksand-Bold",
        "quicksand-semibold": "Quicksand-SemiBold",
        "quicksand-medium": "Quicksand-Medium",
        "quicksand-light": "Quicksand-Light",
      },
    },
  },
  plugins: [],
};
