/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

const main = {
	primary: '#426fb8',
	'primary-focus': '#3869b7',
	'primary-content': '#f2f0ff',

	secondary: '#49959c',
	'secondary-focus': '#3b8087',
	'secondary-content': '#fafeff',

	accent: '#4f5dc4',
	'accent-focus': '#404ca5',
	'accent-content': '#f0f1ff',

	neutral: '#383d47',
	'neutral-focus': '#464c58',
	'neutral-content': '#e5ebf5',

	'base-100': '#ffffff',
	'base-200': '#dde0e9',
	'base-300': '#ced3d9',
	'base-content': '#111317',

	info: '#007be0',
	success: '#01a257',
	warning: '#ffa200',
	error: '#c00707',

	'--rounded-box': '10px',
	'--rounded-btn': '6px',
	'--rounded-badge': '100px',

	'--animation-btn': '0.2s',
	'--animation-input': '.2s',

	'--btn-text-case': 'normal',
	'--navbar-padding': '10px',
	'--border-btn': '1px',

	'.alert': {
		color: '#fff'
	},

	'.btn': {
		animation: 'none',
		transform: 'none'
	}
};

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
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],
					...main
				},
				dark: {
					...require('daisyui/src/theming/themes')['dark'],
					...main,
					neutral: '#383d47',
					'neutral-focus': '#464c58',
					'neutral-content': '#e5ebf5',

					'base-100': '#111317',
					'base-200': '#262931',
					'base-300': '#2e333e',
					'base-content': '#dcdfe5'
				}
			}
		]
	},

	plugins: [require('@tailwindcss/typography'), require('daisyui')]
} as Config;
