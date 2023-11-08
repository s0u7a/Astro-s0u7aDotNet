/** @type {import('tailwindcss').Config} */

import AspectRatio from "@tailwindcss/aspect-ratio";

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [
		AspectRatio
	],
}
