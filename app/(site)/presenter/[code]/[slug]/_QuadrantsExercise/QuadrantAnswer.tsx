"use client"

import React, { useRef } from "react"
import { cx } from "class-variance-authority"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"

interface Props {
	answer: Answer
	showToday: boolean
	showTomorrow: boolean
	showLabels: boolean
	showLines: boolean
	color: string
	animating: boolean
}

export const QuadrantAnswer = ({
	answer,
	showToday,
	showTomorrow,
	showLabels,
	showLines,
	color,
	animating,
}: Props) => {
	const todayRef = useRef<HTMLDivElement>(null)
	const tomorrowRef = useRef<HTMLDivElement>(null)

	const [styles, setStyles] = React.useState({})

	React.useEffect(() => {
		window.addEventListener("resize", getArrowStyles)

		return () => {
			window.removeEventListener("resize", getArrowStyles)
		}
	}, [])

	React.useEffect(() => {
		getArrowStyles()
	}, [showLabels])

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
			<div
				ref={todayRef}
				className={cx(
					"transition-position absolute z-10 -ml-4 -mt-4",
					(showToday && answer.today.placed) || animating
						? "opacity-100"
						: "opacity-0",
					animating ? "duration-[3s]" : "duration-0",
				)}
				style={{
					top: animating ? `${answer.tomorrow.top}%` : `${answer.today.top}%`,
					left: animating
						? `${answer.tomorrow.left}%`
						: `${answer.today.left}%`,
				}}
			>
				<div
					className={cx(
						"h-8 w-8 rounded-full border-4 transition-colors",
						animating ? "duration-[3s]" : "duration-0",
					)}
					style={{
						borderColor: color,
						backgroundColor: animating ? color : "transparent",
					}}
				/>
			</div>

			<div
				ref={tomorrowRef}
				className={cx(
					"absolute z-10 -ml-4 -mt-4",
					!animating && showTomorrow && answer.tomorrow.placed
						? "block"
						: "hidden",
				)}
				style={{
					top: `${answer.tomorrow.top}%`,
					left: `${answer.tomorrow.left}%`,
				}}
			>
				<div
					className="h-8 w-8 rounded-full"
					style={{
						backgroundColor: color,
					}}
				/>
			</div>

			<div
				className={cx(
					"absolute h-1 origin-left",
					!animating &&
						showLines &&
						showToday &&
						answer.today.placed &&
						showTomorrow &&
						answer.tomorrow.placed
						? "opacity-100"
						: "opacity-0",
				)}
				style={{
					top: `${answer.today.top}%`,
					left: `${answer.today.left}%`,
					...styles,
				}}
			>
				<div
					className="absolute left-[0.875rem] top-0 h-full w-[calc(100%-1.75rem)]"
					style={{
						backgroundColor: color,
					}}
				/>
			</div>
		</>
	)
}
