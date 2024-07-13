/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: "'Inter Variable', sans-serif"
			},
			borderRadius: {
				main: '8px'
			}
		}
	},

	daisyui: {
		themes: ['winter']
	},

	plugins: [require('@tailwindcss/typography'), require('daisyui')]
} as Config;
