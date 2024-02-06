import React, { useRef } from "react"
import { cx } from "class-variance-authority"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"

interface Props {
	answer: Answer
	showToday: boolean
	showTomorrow: boolean
	showLines: boolean
	color: string
	animating: boolean
	dotSize?: string
}

export const QuadrantAnswer = ({
	answer,
	showToday,
	showTomorrow,
	showLines,
	color,
	animating,
	dotSize = "w-8 h-8",
}: Props) => {
	const todayRef = useRef<HTMLDivElement>(null)
	const tomorrowRef = useRef<HTMLDivElement>(null)

	const [styles, setStyles] = React.useState({})

	const today = answer?.today
	const tomorrow = answer?.tomorrow

	React.useEffect(() => {
		window.addEventListener("resize", getArrowStyles)

		return () => {
			window.removeEventListener("resize", getArrowStyles)
		}
	}, [])

	React.useEffect(() => {
		getArrowStyles()
	}, [today, tomorrow])

	const getArrowStyles = () => {
		if (todayRef.current && tomorrowRef.current) {
			const today = {
				x: todayRef.current.offsetLeft,
				y: todayRef.current.offsetTop,
			}
			const tomorrow = {
				x: tomorrowRef.current.offsetLeft,
				y: tomorrowRef.current.offsetTop,
			}

			const a = today.x - tomorrow.x
			const b = today.y - tomorrow.y

			const length = Math.sqrt(a * a + b * b)
			const angleDeg =
				Math.atan2(tomorrow.y - today.y, tomorrow.x - today.x) * (180 / Math.PI)

			setStyles({
				transform: `rotate(${angleDeg}deg)`,
				width: `${length}px`,
			})
		} else {
			setStyles({})
		}
	}

	return (
		<>
			{today && (
				<div
					ref={todayRef}
					className={cx(
						"absolute z-10 -ml-4 -mt-4 transition-position",
						showToday || animating ? "opacity-100" : "opacity-0",
						animating ? "duration-[3s]" : "duration-0",
					)}
					style={{
						top: animating ? `${tomorrow?.top || today.top}%` : `${today.top}%`,
						left: animating
							? `${tomorrow?.left || today.left}%`
							: `${today.left}%`,
					}}
				>
					<div
						className={cx(
							"rounded-full border-4 transition-colors",
							animating ? "duration-[3s]" : "duration-0",
							dotSize,
						)}
						style={{
							borderColor: color,
							backgroundColor: animating && tomorrow ? color : "transparent",
						}}
					/>
				</div>
			)}

			{tomorrow && (
				<div
					ref={tomorrowRef}
					className={cx(
						"absolute z-10 -ml-4 -mt-4",
						!animating && showTomorrow ? "block" : "hidden",
					)}
					style={{
						top: `${tomorrow.top}%`,
						left: `${tomorrow.left}%`,
					}}
				>
					<div
						className={cx("rounded-full", dotSize)}
						style={{
							backgroundColor: color,
						}}
					/>
				</div>
			)}

			{today && tomorrow && (
				<div
					className={cx(
						"absolute h-1 origin-left",
						!animating && showLines && showToday && showTomorrow
							? "opacity-100"
							: "opacity-0",
					)}
					style={{
						top: `${today.top}%`,
						left: `${today.left}%`,
						...styles,
					}}
				>
					<div
						className="absolute -top-[0.125rem] left-[0.875rem] h-full w-[calc(100%-1.875rem)]"
						style={{
							backgroundColor: color,
						}}
					/>
					<div
						className="absolute -top-[0.75rem] right-3 h-0 w-0 border-y-[0.75rem] border-l-[1.5rem] !border-y-transparent"
						style={{
							borderColor: color,
						}}
					/>
				</div>
			)}
		</>
	)
}
