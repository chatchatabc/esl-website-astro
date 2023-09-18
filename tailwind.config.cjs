/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        md: "3rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
    extend: {
      colors: {
        p: {
          DEFAULT: "#1b98dc",
          50: "#f1f8fe",
          100: "#e2f1fc",
          200: "#bee3f9",
          300: "#85cbf4",
          400: "#44b1ec",
          500: "#1b98dc",
          600: "#0e79bb",
          700: "#0e6ba8",
          800: "#0f527d",
          900: "#124468",
          950: "#0c2c45",
        },
      },
      backgroundPosition: {
        landing: "25% 25%",
      },
      dropShadow: {
        "esl-sm": "0 10px 8px rgb(0 0 0 / 0.18)",
        "esl-md": "0 10px 8px rgb(0 0 0 / 0.25)",
        "esl-lg": "0 10px 8px rgb(0 0 0 / 0.45)",
      },
    },
  },
  plugins: [],
};
