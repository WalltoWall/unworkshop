"use client"

import React, { useRef } from "react"
import { cx } from "class-variance-authority"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"

interface Props {
	answer: Answer
	showToday: boolean
	showTomorrow: boolean
	showLabels: boolean
	color: string
}

export const QuadrantAnswer = ({
	answer,
	showToday,
	showTomorrow,
	showLabels,
	color,
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
					"absolute z-10 -ml-4 -mt-4",
					showToday && answer.today.placed ? "block" : "hidden",
				)}
				style={{
					top: `${answer.today.top}%`,
					left: `${answer.today.left}%`,
				}}
			>
				<div
					className="h-8 w-8 rounded-full border-4"
					style={{
						borderColor: color,
					}}
				/>
			</div>

			<div
				ref={tomorrowRef}
				className={cx(
					"absolute z-10 -ml-4 -mt-4",
					showTomorrow && answer.tomorrow.placed ? "block" : "hidden",
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
