import { cx } from "class-variance-authority"
import { ArrowRightIcon } from "lucide-react"
import { Spinner } from "./spinner"

export interface ArrowButtonProps {
	direction: "prev" | "next"
	onClick: () => void
	disabled: boolean
	loading?: boolean
}

export const ArrowButton = ({
	direction,
	onClick,
	disabled,
	loading,
}: ArrowButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cx(
			"absolute top-1/2 flex size-8  -translate-y-1/2 items-center justify-center rounded-full bg-black p-2 text-white transition-colors hover:bg-gray-38 disabled:bg-gray-50",
			direction === "prev" ? "left-0" : "right-0 rotate-180",
		)}
		disabled={disabled}
	>
		<span className="sr-only">
			{direction === "next" ? "Next Slide" : "Previous Slide"}
		</span>
		{loading ? <Spinner /> : <ArrowRightIcon />}
	</button>
)
