"use client"

import React from "react"
import clsx from "clsx"
import { uid } from "uid"
import { Text } from "@/components/Text"


interface PresenterViewProps {
	sliders: Array<{ question_text: string; value: number }>
}

export const SlidersPresenterViewClient = ({
	sliders,
}: PresenterViewProps) => {
	return (
		<div className="w-full flex justify-evenly h-[50vh] border-b-[0.666rem] border-black rounded-t-2xl items-end">
			{sliders.map((answer) => (
				<div key={answer.question_text}
				className="relative bg-yellow-68 block min-w-[4rem]"
				style={{
					height: `${answer.value * 10}%`,
				}}
				>
					<span className="absolute -top-8 w-full text-center">
						{answer.value}
					</span>
				</div>
			))}
		</div>
	)
}
