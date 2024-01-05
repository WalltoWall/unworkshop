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
		<div className="relative">
			<div className="absolute top-2 left-0 bg-black rounded-lg p-4">
				{sliders.map((answer, i) => (
					<span className="block text-yellow-68 text-24 font-heading">
						<span className="bg-yellow-68 h-4 w-4 mr-2 inline-block"></span>
						{answer.question_text}
					</span>
				))}
			</div>
			<div className="w-full flex justify-evenly h-[66.6vh] border-b-[0.666rem] border-black rounded-t-2xl items-end">
				{sliders.map((answer, i) => (
					<div key={i}
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
		</div>
	)
}
