import { cva } from "class-variance-authority"

export const text = cva("", {
	variants: {
		size: {
			64: "text-[64px]",
			56: "text-[56px]",
			48: "text-[48px]",
			40: "text-[40px]",
			32: "text-[32px]",
			24: "text-[24px]",
			20: "text-[20px]",
			18: "text-[18px]",
			16: "text-[16px]",
			14: "text-[14px]",
			12: "text-[12px]",
		},
		style: {
			heading:
				"font-heading uppercase font-extrabold leading-none tracking-[0.00359em]",
			copy: "font-sans leading-tight",
			contextMenu: "font-sans leading-[1.07]",
			serif: "font-serif font-semibold leading-none",
		},
	},
	compoundVariants: [
		{
			size: 24,
			style: "copy",
			className: "leading-[1.3]",
		},
		{
			size: 16,
			style: "copy",
			className: "leading-[1.4]",
		},
		{
			size: 12,
			style: "copy",
			className: "leading-normal",
		},
	],
})
