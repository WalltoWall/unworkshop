"use client"

import React from "react"
import type { SliderAnswers } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

interface barProps {
	answers: SliderAnswers
	images: boolean
}

export const SlidersBars = ({ answers, images }: barProps) => {
	const [color, setColor] = React.useState("#fecb2f")
	const Bars = (hasImages: boolean) => {
		let content = []

		// 1 = minRange and 6 = max slider range.
		for (let i = 1; i <= 6; i++) {
			let countToday = 0
			let countTomorrow = 0

			// find answers that match iteration
			answers.map(
				(answer) => (
					answer.today == i ? countToday++ : countToday,
					answer.tomorrow == i ? countTomorrow++ : countTomorrow
				),
			)

			// find a percentage of answers.
			let allAnswers = countToday + countTomorrow
			let todayResults = (countToday / allAnswers) * 100
			let tomorrowResults = (countTomorrow / allAnswers) * 100

			// push html to the array
			content.push(
				<div
					key={i}
					className="flex h-full w-full items-end justify-between gap-2"
				>
					<div
						className={"bg-yellow-68 relative block w-full max-w-[4rem]"}
						style={{
							height: countToday == 0 ? "1rem" : `${todayResults}%`,
						}}
					>
						{!hasImages && (
							<span className="absolute -top-6 z-20 w-full text-center">
								{countToday}
							</span>
						)}
					</div>
					<div
						key={i}
						className={"bg-yellow-68 relative block w-full max-w-[4rem]"}
						style={{
							height: countTomorrow == 0 ? "1rem" : `${tomorrowResults}%`,
							backgroundImage: `repeating-linear-gradient(-45deg,${color},${color} 2px,rgba(0,0,0,0) 2px,rgba(0,0,0,0) 18px)`,
							backgroundColor: "transparent",
							border: `2px solid ${color}`,
							borderBottom: `none`,
						}}
					>
						{!hasImages && (
							<span className="absolute -top-6 z-20 w-full text-center">
								{countTomorrow}
							</span>
						)}
					</div>
				</div>,
			)
		}
		return content
	}

	return (
		<div
			className="left-0 right-0 top-0 flex w-full items-end justify-evenly gap-4 px-4 pt-8 lg:gap-8"
			style={{
				position: images ? "absolute" : "static",
				height: images ? "calc(50vh - 0.666rem)" : "100%",
			}}
		>
			{Bars(images)}
		</div>
	)
}
