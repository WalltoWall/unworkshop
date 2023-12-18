"use client"

import React from "react"
import { SwatchesPicker } from "react-color"
import { useDrag, useDrop } from "react-dnd"
import clsx from "clsx"
import { BarChart } from "@/components/icons/BarChart"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"

interface CardColumnProps {
	cards: string[]
}

export const ItemTypes = {
	CARD: "card",
}

export const CardColumn = ({ cards }: CardColumnProps) => {
	const [color, setColor] = React.useState<string>("#96fad1")
	const [showPicker, setShowPicker] = React.useState(false)
	const [title, setTitle] = React.useState<string>("Service")
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

	function moveCard(x: number, y: number) {
		console.log(x, y)
	}

	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.CARD,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}))

	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: ItemTypes.CARD,
			drop: () => moveCard(1, 2),
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
			}),
		}),
		[],
	)

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
					<input
						onChange={(e) => setTitle(e.target.value)}
						value={title}
						className="mt-1 bg-transparent font-bold uppercase text-black outline-none ring-0 text-18 leading-[1.3125] font-heading"
					/>
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

			<div className=" mt-5 flex h-full w-full flex-col gap-2" ref={drop}>
				{cards.map((card, idx) => (
					<div
						key={idx}
						className=" rounded-lg px-3.5 py-4"
						style={{
							backgroundColor: color,
							opacity: isDragging ? 0.5 : 1,
							cursor: "move",
						}}
						ref={drag}
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
