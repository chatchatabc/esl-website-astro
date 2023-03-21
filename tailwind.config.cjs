/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {

			colors:{
				'transparent':'transparent',
				'esl':{
					'primary' : '#015CB9',
					'secondary':'#23085A',
					'tertiary' :'#00DCFF',
					'quarternary': '#23085A',
				},
			},
			fontSize:{
					'esl-1' : '0.75em',
					'esl-2' : '1em',
					'esl-3' : '1.33em',
					'esl-4' : '1.77em',
					'esl-5' : '2.369em',
					'esl-6' : '3.157em',
			}

		},
		
	},
	plugins: [],
}
