/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {

      colors: {
        'transparent': 'transparent',
        'esl-c': {
          '1': '#015CB9',
          '2': '#23085A',
          '3': '#00DCFF',
          '5': '#CAECFF'
        },
      },
      fontSize: {
        'esl-1': '0.75em',
        'esl-2': '1em',
        'esl-3': '1.33em',
        'esl-4': '1.77em',
        'esl-5': '2.369em',
        'esl-6': '3.157em',
      },
      backgroundPosition:{
        'landing': '25% 25%'
      }

    },

  },
  plugins: [],
}
