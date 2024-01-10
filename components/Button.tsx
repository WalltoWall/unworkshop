import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

const button = cva(
	[
		"inline-flex justify-center items-center text-center gap-2.5 pb-1",
		"border border-solid leading-none disabled:cursor-not-allowed",
	],
	{
		variants: {
			color: {
				gray: "border-gray-75 text-black bg-gray-75",
				black: "border-black text-white bg-black",
			},
			size: {
				xs: "h-9 text-12 px-3",
				sm: "h-8 text-16 px-5",
				base: "h-11 text-24 px-5",
			},
			outline: {
				true: "bg-transparent",
			},
			inactive: {
				true: "bg-transparent cursor-not-allowed",
			},
			uppercase: {
				true: "uppercase",
			},
			rounded: {
				base: "rounded-2xl",
				sm: "rounded-lg",
			},
			fontFamily: {
				heading: "font-heading",
				sans: "font-sans",
			},
		},
		defaultVariants: {
			size: "base",
			outline: false,
			color: "black",
			uppercase: true,
			rounded: "base",
			fontFamily: "heading",
		},
		compoundVariants: [
			{
				outline: true,
				color: "gray",
				className: "text-gray-75",
			},
			{
				outline: true,
				color: "black",
				className: "!text-black",
			},
			{
				inactive: true,
				color: "black",
				className: "!text-black",
			},
		],
	},
)

type PlainButtonProps = React.ComponentPropsWithoutRef<"button">
type PlainAnchorProps = Omit<React.ComponentPropsWithRef<"a">, "href"> &
	Pick<LinkProps, "href">
type ButtonVariants = VariantProps<typeof button>

export type ButtonProps = (PlainButtonProps | PlainAnchorProps) & ButtonVariants

/**
 * Smartly renders a <button> element or a `<Link />` component with
 * pre-determined styling based on the presence of the `href` prop.
 *
 * @example
 * Rendering an anchor element (`<a>`) tag:
 * ```
 * <Button href="/">Learn More</Button>
 * ```
 *
 * @example
 * Rendering a plain button:
 * ```
 * <Button onClick={submitForm}>Submit</Button>
 * ```
 */
export const Button = React.forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	ButtonProps
>(
	(
		{
			children,
			className,
			color,
			size,
			outline,
			uppercase,
			inactive,
			rounded,
			fontFamily,
			...props
		},
		ref,
	) => {
		className = button({
			className,
			color,
			size,
			outline,
			inactive,
			uppercase,
			rounded,
			fontFamily,
		})

		if ("href" in props && props.href) {
			return (
				<Link
					className={className}
					ref={ref as React.ForwardedRef<HTMLAnchorElement>}
					{...props}
				>
					{children}
				</Link>
			)
		}

		return (
			<button
				ref={ref as React.ForwardedRef<HTMLButtonElement>}
				className={className}
				{...(props as PlainButtonProps)}
			>
				{children}
			</button>
		)
	},
)

Button.displayName = "Button"
