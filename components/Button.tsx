import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link, { type LinkProps } from "next/link"

const innerButton = cva("capsize font-heading leading-none", {
	variants: {
		uppercase: {
			true: "uppercase",
		},
		size: {
			sm: "text-16",
			base: "text-24",
		},
	},
	defaultVariants: {
		uppercase: true,
		size: "base",
	},
})

type InnerButtonProps = VariantProps<typeof innerButton> & {
	children: React.ReactNode
}

const InnerButton = (props: InnerButtonProps) => {
	return (
		<div
			className={innerButton({ uppercase: props.uppercase, size: props.size })}
		>
			{props.children}
		</div>
	)
}

const button = cva(
	[
		"inline-flex justify-center items-center text-center rounded-2xl focus:ring-1 outline-none px-5",
		"border border-solid",
	],
	{
		variants: {
			color: {
				gray: "border-gray-75 text-black ring-gray-75 bg-gray-75",
				black: "border-black text-white ring-black bg-black",
			},
			size: {
				sm: "h-8",
				base: "h-11",
			},
			outline: {
				true: "bg-transparent",
			},
		},
		defaultVariants: {
			size: "base",
			outline: false,
			color: "black",
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
				className: "text-black",
			},
		],
	},
)

type PlainButtonProps = React.ComponentPropsWithoutRef<"button">
type PlainAnchorProps = Omit<React.ComponentPropsWithRef<"a">, "href"> &
	Pick<LinkProps<string>, "href">
type ButtonVariants = VariantProps<typeof button> & InnerButtonProps

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
>(({ children, className, color, size, outline, uppercase, ...props }, ref) => {
	className = button({ className, color, size, outline })
	const innerButtonProps: InnerButtonProps = { size, uppercase, children }

	if ("href" in props && props.href) {
		return (
			<Link
				className={className}
				ref={ref as React.ForwardedRef<HTMLAnchorElement>}
				{...props}
			>
				<InnerButton {...innerButtonProps} />
			</Link>
		)
	}

	return (
		<button
			ref={ref as React.ForwardedRef<HTMLButtonElement>}
			className={className}
			{...(props as PlainButtonProps)}
		>
			<InnerButton {...innerButtonProps} />
		</button>
	)
})

Button.displayName = "Button"
