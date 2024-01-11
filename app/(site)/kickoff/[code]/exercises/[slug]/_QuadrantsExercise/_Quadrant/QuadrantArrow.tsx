import { cx } from "class-variance-authority"
import styles from "./QuadrantExercise.module.css"

interface QuadrantArrowProps {
	top?: number
	left?: number
	tomorrowPlaced: boolean
	width: number
	angle: number
}

export const QuadrantArrow = ({
	top,
	left,
	tomorrowPlaced,
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
			<div className="bg-indigo-68" />
			<div className="border-l-indigo-68" />
		</div>
	) : null
}
