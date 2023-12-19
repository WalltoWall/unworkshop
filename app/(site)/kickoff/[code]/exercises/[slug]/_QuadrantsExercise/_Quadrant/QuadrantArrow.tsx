import { cx } from "class-variance-authority"
import type { Result } from "../QuadrantsExercise"
import styles from "./QuadrantExercise.module.css"

interface QuadrantArrowProps {
	top: number
	left: number
	width: number
	angle: number
	opacity: string
	time: false | "today" | "tomorrow"
}

export const QuadrantArrow = ({
	top,
	left,
	width,
	angle,
	opacity,
	time,
}: QuadrantArrowProps) => {
	return (
		<div
			className={cx("absolute h-1 origin-left", styles.arrowBetween, opacity)}
			style={{
				top: `${top}%`,
				left: `${left}%`,
				width: `${width}%`,
				transform: `rotate(${angle}deg)`,
			}}
		>
			<div className={cx("bg-indigo-68", !time && "!w-full")} />
			<div className={cx("border-l-indigo-68", !time && "opacity-0")} />
		</div>
	)
}
