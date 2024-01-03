import { cx } from "class-variance-authority"
import type { State } from "../QuadrantSteps"
import styles from "./QuadrantExercise.module.css"

interface QuadrantArrowProps {
	top?: number
	left?: number
	tomorrowPlaced: boolean
	state: State
	width: number
	angle: number
}

export const QuadrantArrow = ({
	top,
	left,
	tomorrowPlaced,
	state,
	width,
	angle,
}: QuadrantArrowProps) => {
	return top && left && tomorrowPlaced ? (
		<div
			className={cx("absolute h-1 origin-left", styles.arrowBetween)}
			style={{
				top: `${top}%`,
				left: `${left}%`,
				width: `${width}%`,
				transform: `rotate(${angle}deg)`,
			}}
		>
			<div className={cx("bg-indigo-68", state === "complete" && "!w-full")} />
			<div
				className={cx(
					"border-l-indigo-68",
					state === "complete" && "opacity-0",
				)}
			/>
		</div>
	) : null
}
