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
	const [color, setColor] = React.useState("#fecb2f")

	return (
		<div className="relative">
			<div className="absolute top-7 left-7 rounded-2xl bg-black px-5 py-4 text-white">
				<div className="mb-2 flex items-center">
					<span
						className="block h-6 w-6"
						style={{
							backgroundColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						<span style={{
							color: color,
						}}>
							Today
						</span>
					</Text>
				</div>

				<div className="flex items-center">
					<span
						className="block h-6 w-6 border-4"
						style={{
							borderColor: color,
						}}
					/>
					<Text className="ml-1 uppercase text-24 font-heading capsize">
						<span style={{
							color: color,
						}}>
							Tomorrow
						</span>
					</Text>
				</div>
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
