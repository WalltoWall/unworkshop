import { cx } from "class-variance-authority"

const variants = {
	filled: "border-transparent bg-indigo-68",
	unfilled: "bg-transparent",
}

export interface DotProps {
	className?: string
	variant: keyof typeof variants
}

export const Dot = (props: DotProps) => {
	return (
		<div
			className={cx(
				props.className,
				variants[props.variant],
				"size-8 shrink-0 rounded-full border-4 border-indigo-68",
			)}
		/>
	)
}
