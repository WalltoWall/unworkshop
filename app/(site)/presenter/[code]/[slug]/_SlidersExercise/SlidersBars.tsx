"use client"

import React from "react"
import * as R from "remeda"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

interface barProps {
	answers: Array<Answer>
	barColor: string
	showNumbers: boolean
	showToday: boolean
	showTomorrow: boolean
}

export const SlidersBars = ({
	answers,
	barColor,
	showNumbers,
	showToday,
	showTomorrow,
}: barProps) => {
	const totals = answers.reduce(
		(acc, curr) => {
			acc[curr.today - 1].today++
			acc[curr.tomorrow - 1].tomorrow++

			return acc
		},
		R.times(6, () => ({ today: 0, tomorrow: 0 })),
	)

	return (
		<div className="flex h-full grow justify-between px-4 pt-10">
			{totals.map((total, idx) => (
				<div key={idx} className="flex w-32 items-end gap-2">
					{showToday && (
						<div
							className="relative min-h-4 w-full"
							style={{
								backgroundColor: barColor,
								height: `${(total.today / answers.length) * 100}%`,
							}}
						>
							{showNumbers && (
								<span className="absolute -top-10 z-10 w-full text-center text-24 font-heading">
									{total.today}
								</span>
							)}
						</div>
					)}
					{showTomorrow && (
						<div
							className="relative min-h-4 w-full"
							style={{
								backgroundImage: `repeating-linear-gradient(-45deg,${barColor},${barColor} 2px,rgba(0,0,0,0) 2px,rgba(0,0,0,0) 18px)`,
								backgroundColor: "transparent",
								height: `${(total.tomorrow / answers.length) * 100}%`,
								border: `2px solid ${barColor}`,
							}}
						>
							{showNumbers && (
								<span className="absolute -top-10 z-10 w-full text-center text-24 font-heading">
									{total.tomorrow}
								</span>
							)}
						</div>
					)}
				</div>
			))}
		</div>
	)
}
