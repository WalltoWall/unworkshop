import { cx } from "class-variance-authority"
import styles from "./QuadrantExercise.module.css"
import type { Result } from "./QuadrantsExercise"

interface QuadrantArrowProps {
	result: {
		top: number
		left: number
		width: number
		angle: number
	}
	opacity: string
	time: string | null
}

export const QuadrantArrow = ({
	result,
	opacity,
	time,
}: QuadrantArrowProps) => {
	return (
		<div
			className={cx("absolute h-1 origin-left", styles.arrowBetween, opacity)}
			style={{
				top: `${result.top}%`,
				left: `${result.left}%`,
				width: `${result.width}%`,
				transform: `rotate(${result.angle}deg)`,
			}}
		>
			<div className={cx("bg-indigo-68", !time && "!w-full")} />
			<div className={cx("border-l-indigo-68", !time && "opacity-0")} />
		</div>
	)
}
