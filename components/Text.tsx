import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

const text = cva("", {
	variants: {
		size: {
			64: "text-[64px]",
			56: "text-[56px]",
			48: "text-[48px]",
			40: "text-[40px]",
			32: "text-[32px]",
			24: "text-[24px]",
			16: "text-[16px]",
			12: "text-[12px]",
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
			className: "leading-[1.5]",
		},
	],
	defaultVariants: {},
})

type TextVariants = VariantProps<typeof text>
type TextProps = React.ComponentPropsWithoutRef<"div"> &
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
