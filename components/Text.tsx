"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

export const text = cva("", {
	variants: {
		size: {
			64: "text-64",
			56: "text-56",
			48: "text-48",
			40: "text-40",
			32: "text-32",
			24: "text-24",
			16: "text-16",
			12: "text-12",
		},
		style: {
			heading: "font-heading uppercase font-bold leading-[0.9]",
			copy: "font-sans",
		},
	},
	compoundVariants: [
		{
			size: 24,
			style: "copy",
			className: "leading-copyMega",
		},
		{
			size: 16,
			style: "copy",
			className: "leading-copy",
		},
		{
			size: 12,
			style: "copy",
			className: "leading-copyMicro",
		},
	],
	defaultVariants: {},
})

type TextVariants = VariantProps<typeof text>
type TextProps = Omit<React.ComponentPropsWithoutRef<"div">, "style"> &
	TextVariants & { asChild?: boolean }

/**
 * A polymorphic component for rendering text with pre-determined styling. Use
 * the `asChild` prop for type-safe access to HTML tags other than the `<p>`
 * tag.
 *
 * @see https://www.radix-ui.com/docs/primitives/utilities/slot
 *
 * @example
 * Basic usage:
 * ```
 * <Text style="heading" size={24}>Hello World!</Text>
 * ```
 *
 * @example
 * Using a custom HTML tag:
 * ```
 * <Text style="heading" size={24} asChild>
 *   <h2>Hello World!</h2>
 * </Text>
 * ```
 */
export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
	({ className, size, style, asChild, ...props }, ref) => {
		const Element = asChild ? Slot : "p"

		return (
			<Element
				ref={ref}
				className={text({ className, size, style })}
				{...props}
			/>
		)
	},
)

Text.displayName = "Text"
