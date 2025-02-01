"use client"

import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { type VariantProps } from "class-variance-authority"
import { text } from "@/styles/text"

export type TextVariants = VariantProps<typeof text>
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
