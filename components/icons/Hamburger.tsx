import type { Dispatch, SetStateAction } from "react"
import { cx } from "class-variance-authority"

interface BarProps {
	className?: string
}

const Bar = ({ className }: BarProps) => (
	<span
		className={cx(
			"absolute block h-1 w-[1.625rem] rounded-[0.125rem] bg-white transition-all",
			className,
		)}
	/>
)

interface HamburgerProps {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const Hamburger = ({ open, setOpen }: HamburgerProps) => {
	return (
		<button
			onClick={() => setOpen((prev) => !prev)}
			className="relative ml-auto h-8 w-8"
		>
			<Bar
				className={cx(open ? "top-[0.875rem] rotate-45" : "top-[0.375rem]")}
			/>
			<Bar
				className={cx("top-[0.875rem]", open ? "opacity-0" : "opacity-100")}
			/>
			<Bar
				className={cx(open ? "top-[0.875rem] -rotate-45" : "top-[1.375rem]")}
			/>
		</button>
	)
}
