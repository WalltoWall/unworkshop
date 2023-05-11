import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link, { type LinkProps } from "next/link"

const button = cva(
	[
		"inline-flex justify-center items-center text-center rounded-2xl focus:ring-1 outline-none px-5",
		"border border-solid font-heading leading-none",
	],
	{
		variants: {
			color: {
				gray: "border-gray-75 text-black ring-gray-75 bg-gray-75",
				black: "border-black text-white ring-black bg-black",
			},
			size: {
				sm: "h-8 text-16",
				base: "h-11 text-24",
			},
			outline: {
				true: "bg-transparent",
			},
			disabled: {
				true: "bg-transparent cursor-not-allowed",
			},
			uppercase: {
				true: "uppercase",
			},
		},
		defaultVariants: {
			size: "base",
			outline: false,
			color: "black",
			uppercase: true,
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
				disabled: true,
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
			disabled,
			...props
		},
		ref,
	) => {
		className = button({
			className,
			color,
			size,
			outline,
			disabled,
			uppercase,
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
				disabled={disabled ?? false}
				{...(props as PlainButtonProps)}
			>
				{children}
			</button>
		)
	},
)

Button.displayName = "Button"
