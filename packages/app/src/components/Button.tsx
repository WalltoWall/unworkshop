import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

const button = cva(
	[
		"inline-flex justify-center items-center text-center transition border border-solid leading-[1.25] disabled:cursor-not-allowed",
	],
	{
		variants: {
			color: {
				gray: "border-neutral-700 text-black bg-neutral-700",
				black: "border-black text-white bg-black hover:bg-neutral-800",
			},
			size: {
				xs: "h-9 text-[12px] px-3 gap-1.5",
				sm: "h-8 text-[16px] px-4 gap-1.5",
				md: "h-10 text-[21px] px-4 gap-2 pb-px",
				base: "h-11 text-[24px] px-5 gap-2.5 pb-px",
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
				className: "text-neutral-300",
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

type PlainButtonProps = React.ComponentProps<"button">
type PlainAnchorProps = Omit<React.ComponentProps<"a">, "href"> &
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
export const Button = ({
	children,
	className,
	color,
	size,
	outline,
	uppercase,
	inactive,
	rounded,
	fontFamily,
	ref,
	...props
}: ButtonProps) => {
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
				ref={ref as React.Ref<HTMLAnchorElement>}
				{...props}
			>
				{children}
			</Link>
		)
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			className={className}
			{...(props as PlainButtonProps)}
		>
			{children}
		</button>
	)
}
