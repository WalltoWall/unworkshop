import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./app/**/*.{js,ts,jsx,tsx}",
	],
	experimental: { optimizeUniversalDefaults: true },
	theme: {
		fontFamily: {
			sans: ["var(--font-trade-gothic)", "system-ui"],
			heading: ["var(--font-trade-gothic-bold-condensed)", "system-ui"],
		},

		capsize: {
			metrics: {
				sans: {
					capHeight: 722,
					ascent: 722,
					descent: -278,
					lineGap: 200,
					unitsPerEm: 1000,
					xHeight: 520,
					xWidthAvg: 437,
				},
				heading: {
					capHeight: 722,
					ascent: 722,
					descent: -278,
					lineGap: 200,
					unitsPerEm: 1000,
					xHeight: 520,
					xWidthAvg: 365,
				},
			},
		},

		lineHeight: {
			none: "1",
			copyMega: "1.3",
			copy: "1.4",
			copyMicro: "1.5",
			heading: "0.9",
		},

		fontSize: {
			64: "4rem",
			56: "3.5rem",
			48: "3rem",
			40: "2.5rem",
			32: "2rem",
			24: "1.5rem",
			16: "1rem",
			12: ".75rem",
		},

		colors: {
			transparent: "#fff0",
			white: "#fff",
			black: "#000",

			gray: {
				82: "#cdd6d4",
				75: "#bfbfbf",
				50: "#7f7f7f",
				58: "#8ca09c",
				38: "#5a6c69",
				19: "#2c3533",
			},

			red: {
				76: "#ff9488",
				70: "#ff7566",
				63: "#ff5745",
				57: "#e8503f",
				46: "#ba4033",
			},

			orange: {
				73: "#ff9e77",
				66: "#ff8655",
				63: "#ff7a45",
				57: "#e86f3f",
				52: "#d16439",
			},

			yellow: {
				77: "#ffee8b",
				70: "#ffe96a",
				64: "#ffe54a",
				58: "#e8d144",
				52: "#d1bc3d",
			},

			green: {
				78: "#96fad1",
				65: "#57f7b6",
				52: "#19f49b",
				48: "#17de8d",
				38: "#13b271",
			},

			indigo: {
				82: "#a6afff",
				73: "#7987ff",
				68: "#5c6dff",
				55: "#4c5ad1",
				49: "#4350ba",
			},

			violet: {
				80: "#d7a0fa",
				70: "#c371f8",
				64: "#b652f7",
				58: "#a64be1",
				47: "#853cb4",
			},

			pink: {
				85: "#ffb7f1",
				78: "#ff93ea",
				74: "#ff7be6",
				67: "#e870d2",
				63: "#e165bd",
			},
		},
	},
	plugins: [
		require("@asyarb/tailwind-capsize"),
		plugin(({ addUtilities }) => {
			addUtilities({
				".scrollbar-hide": {
					/* IE and Edge */
					"-ms-overflow-style": "none",

					/* Firefox */
					"scrollbar-width": "none",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},

				".scrollbar-default": {
					/* IE and Edge */
					"-ms-overflow-style": "auto",

					/* Firefox */
					"scrollbar-width": "auto",

					/* Safari and Chrome */
					"&::-webkit-scrollbar": {
						display: "block",
					},
				},
			})
		}),
	],
} satisfies Config
