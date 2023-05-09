import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link, { type LinkProps } from "next/link"

const InnerButton = (props: { children: React.ReactNode }) => {
	return (
		<div className="uppercase text-16 leading-none font-heading capsize">
			{props.children}
		</div>
	)
}

const button = cva(
	"inline-flex justify-center items-center text-center h-8 rounded-2xl focus:ring-1 outline-none px-5",
	{
		variants: {
			border: {
				true: "border border-solid",
			},
			color: {
				gray: "border-gray-75 text-gray-75 ring-gray-75",
			},
		},
		defaultVariants: {
			border: true,
			color: "gray",
		},
	},
)

type PlainButtonProps = React.ComponentPropsWithoutRef<"button">
type PlainAnchorProps = Omit<React.ComponentPropsWithRef<"a">, "href"> &
	Pick<LinkProps<string>, "href">
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
>(({ children, className, ...props }, ref) => {
	className = button({ className })

	if ("href" in props && props.href) {
		return (
			<Link
				className={className}
				ref={ref as React.ForwardedRef<HTMLAnchorElement>}
				{...props}
			>
				<InnerButton>{children}</InnerButton>
			</Link>
		)
	}

	return (
		<button
			ref={ref as React.ForwardedRef<HTMLButtonElement>}
			className={className}
			{...(props as PlainButtonProps)}
		>
			<InnerButton>{children}</InnerButton>
		</button>
	)
})

Button.displayName = "Button"
