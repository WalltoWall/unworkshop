import type { Dispatch, SetStateAction } from "react"
import { cx } from "class-variance-authority"

interface BarProps {
	className?: string
}

const Bar = ({ className }: BarProps) => (
	<span
		className={cx(
			"absolute block h-1 w-[1.625rem] rounded-[0.125rem] transition-all",
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
			className="relative z-20 ml-auto h-8 w-8"
		>
			<Bar
				className={cx(
					open
						? "top-[0.875rem] rotate-45 bg-black"
						: "top-[0.375rem] bg-white",
				)}
			/>
			<Bar
				className={cx(
					"top-[0.875rem]",
					open ? "bg-black opacity-0" : "bg-white opacity-100",
				)}
			/>
			<Bar
				className={cx(
					open
						? "top-[0.875rem] -rotate-45 bg-black"
						: "top-[1.375rem] bg-white",
				)}
			/>
		</button>
	)
}
