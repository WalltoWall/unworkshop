"use client"

import React from "react"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

interface barProps {
	answers: Array<Answer>
	showImages: boolean
	barColor: string
	showNumbers: boolean
	showToday: boolean
	showTomorrow: boolean
}

export const SlidersBars = ({
	answers,
	barColor,
	showNumbers,
	showImages,
	showToday,
	showTomorrow,
}: barProps) => {
	let today = 0
	let tomorrow = 0
	const fakeArray = Array(6).fill("")

	return (
		<div
			className="left-0 right-0 top-0 flex w-full min-w-0 items-end justify-between px-4 pt-10"
			style={{
				position: showImages ? "absolute" : "static",
				height: showImages ? "calc(45vh - 0.666rem)" : "100%",
			}}
		>
			{fakeArray.map((_val, idx) => {
				today = 0
				tomorrow = 0

				answers.map((answer) => {
					if (answer.today === idx + 1) today++
					if (answer.tomorrow === idx + 1) tomorrow++
				})

				return (
					<div
						key={`today-tomorrow-${idx}`}
						className="flex h-full w-fit min-w-[8rem] items-end gap-2"
					>
						{showToday && (
							<div
								className="relative w-full"
								style={{
									height:
										today == 0
											? "1rem"
											: `${(today / (today + tomorrow)) * 100}%`,
									backgroundColor: barColor,
								}}
							>
								{showNumbers && (
									<span className="absolute -top-10 z-20 w-full text-center text-24 font-heading">
										{today}
									</span>
								)}
							</div>
						)}
						{showTomorrow && (
							<div
								className="relative w-full"
								style={{
									height:
										tomorrow == 0
											? "1rem"
											: `${(tomorrow / (today + tomorrow)) * 100}%`,
									backgroundImage: `repeating-linear-gradient(-45deg,${barColor},${barColor} 2px,rgba(0,0,0,0) 2px,rgba(0,0,0,0) 18px)`,
									backgroundColor: "transparent",
									border: `2px solid ${barColor}`,
								}}
							>
								{showNumbers && (
									<span className="absolute -top-10 z-20 w-full text-center text-24 font-heading">
										{tomorrow}
									</span>
								)}
							</div>
						)}
					</div>
				)
			})}
		</div>
	)
}
