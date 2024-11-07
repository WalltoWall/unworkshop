import React from "react"
import { cx } from "class-variance-authority"

const variants = {
	filled: "border-transparent bg-indigo-68",
	unfilled: "bg-transparent",
}

export interface DotProps {
	className?: string
	variant: keyof typeof variants
}

export const Dot = React.forwardRef<HTMLDivElement, DotProps>(
	({ className, variant, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cx(
					className,
					variants[variant],
					"size-8 shrink-0 rounded-full border-4 border-indigo-68",
				)}
				{...props}
			/>
		)
	},
)
Dot.displayName = "Dot"
