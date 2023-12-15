"use client"

import React from "react"
import { SwatchesPicker } from "react-color"
import clsx from "clsx"
import { BarChart } from "@/components/icons/BarChart"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"

interface CardColumnProps {
	cards: string[]
}

export const CardColumn = ({ cards }: CardColumnProps) => {
	const [color, setColor] = React.useState("#96fad1")
	const [showPicker, setShowPicker] = React.useState(false)
	const colorGroups = [
		["#ff9488", "#ff7566", "#ff5745", "#e8503f", "#ba4033"],
		["#ff9e77", "#ff8655", "#ff7a45", "#e86f3f", "#d16439"],
		["#ffee8b", "#ffe96a", "#ffe54a", "#e8d144", "#d1bc3d"],
		["#96fad1", "#57f7b6", "#19f49b", "#17de8d", "#13b271"],
		["#a6afff", "#7987ff", "#5c6dff", "#4c5ad1", "#4350ba"],
		["#d7a0fa", "#c371f8", "#b652f7", "#a64be1", "#853cb4"],
		["#ffb7f1", "#fab99e", "#ff93ea", "#ff7be6", "#e870d2", "#e165bd"],
		[
			"#f7f7f7",
			"#E5E5E5",
			"#cdd6d4",
			"#bfbfbf",
			"#7f7f7f",
			"#8ca09c",
			"#5a6c69",
			"#2c3533",
		],
	]

	return (
		<div className="w-[306px] animate-fadeIn rounded-2xl bg-gray-90 px-2 py-3">
			<div className="flex items-center justify-between">
				<div className="relative flex items-center gap-2">
					<SwatchesPicker
						colors={colorGroups}
						onChange={(newColor) => {
							setColor(newColor.hex)
							setShowPicker(false)
						}}
						className={clsx("absolute", showPicker ? "block" : "hidden")}
					/>
					<button
						className="h-5 w-5 rounded-full border border-black"
						style={{ backgroundColor: color }}
						onClick={() => setShowPicker(!showPicker)}
					></button>
					<Text style={"heading"} size={18}>
						Service
					</Text>
				</div>
				<div className="flex items-center gap-3">
					<button>
						<BarChart className="w-5" />
					</button>
					<button>
						<BlackXIcon className="w-7" />
					</button>
				</div>
			</div>

			<div className="mt-5 flex flex-col gap-2">
				{cards.map((card, idx) => (
					<div
						key={idx}
						className="rounded-lg px-3.5 py-4"
						style={{ backgroundColor: color }}
					>
						<Text style={"copy"} size={18}>
							{card}
						</Text>
					</div>
				))}
			</div>
		</div>
	)
}
