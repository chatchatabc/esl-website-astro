/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        "esl-c": {
          1: "#015CB9",
          2: "#23085A",
          3: "#00DCFF",
          5: "#CAECFF",
        },
      },
      fontSize: {
        //figure based on figma design
        "esl-1": "0.75rem", //15px
        "esl-2": "1rem", //20px
        "esl-3": "1.33rem", //26px
        "esl-4": "1.77rem", //35.54 px
        "esl-5": "2.369rem", //47.37 px
        "esl-6": "3.157rem", //63.15 px
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
