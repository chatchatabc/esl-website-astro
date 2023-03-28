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
        'esl-1': '0.75rem',
        'esl-2': '1rem',
        'esl-3': '1.33rem',
        'esl-4': '1.77rem',
        'esl-5': '2.369rem',
        'esl-6': '3.157rem',
      },
      backgroundPosition:{
        'landing': '25% 25%'
      }

    },

  },
  plugins: [],
}
