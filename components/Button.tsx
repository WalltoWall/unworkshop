import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"

const button = cva("", {
	variants: {},
})

type PlainButtonProps = React.ComponentPropsWithoutRef<"button">
type PlainAnchorProps = React.ComponentPropsWithoutRef<"a">
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
		const { href } = props

		return (
			<Link
				className={className}
				ref={ref as React.ForwardedRef<HTMLAnchorElement>}
				href={href}
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
})

Button.displayName = "Button"
