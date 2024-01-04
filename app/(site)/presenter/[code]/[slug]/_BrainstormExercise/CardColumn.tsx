"use client"

import React from "react"
import { SwatchesPicker } from "react-color"
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type Active,
} from "@dnd-kit/core"
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import clsx from "clsx"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Text } from "@/components/Text"
import { PresentColumnModal } from "./PresentColumnModal"
import { Draggable, SortableItem } from "./SortableItem"
import { SortableOverlay } from "./SortableOverlay"

interface CardColumnProps {
	cards: Array<{ response: string; id: string }>
	id: string
	removeColumn: (id: string) => void
}

export const CardColumn = ({ cards, id, removeColumn }: CardColumnProps) => {
	const [color, setColor] = React.useState<string>("#96fad1")
	const [showPicker, setShowPicker] = React.useState(false)
	const [title, setTitle] = React.useState<string>("Service")
	const [active, setActive] = React.useState<Active | null>(null)
	const [columnCards, setColumnCards] = React.useState(cards)

	const activeItem = React.useMemo(
		() => columnCards.find((card) => card.id === active?.id),
		[active, columnCards],
	)
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

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
		<DndContext
			sensors={sensors}
			onDragStart={({ active }) => {
				setActive(active)
			}}
			onDragEnd={({ active, over }) => {
				if (over && active.id !== over?.id) {
					const activeIndex = columnCards.findIndex(
						({ id }) => id === active.id,
					)
					const overIndex = columnCards.findIndex(({ id }) => id === over.id)

					setColumnCards(arrayMove(columnCards, activeIndex, overIndex))
				}

				setActive(null)
			}}
			onDragCancel={() => {
				setActive(null)
			}}
		>
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
							className="mt-2 bg-transparent font-bold uppercase text-black outline-none ring-0 text-18 leading-[1.3125] font-heading"
						/>
					</div>
					<div className="flex items-center gap-3">
						<PresentColumnModal
							cards={columnCards}
							color={color}
							columnTitle={title}
						/>
						<button onClick={() => removeColumn(id)}>
							<BlackXIcon className="w-7" />
						</button>
					</div>
				</div>

				<SortableContext items={columnCards}>
					<ul className="mt-5 flex h-full w-full flex-col gap-2">
						{columnCards.length > 0 ? (
							columnCards.map((card) => (
								<SortableItem
									key={card.id}
									id={card.id}
									color={color}
									className="box-border flex cursor-move list-none items-center rounded-lg px-3.5 py-4"
								>
									<Draggable response={card.response} />
								</SortableItem>
							))
						) : (
							<div
								className="rounded-lg px-3.5 py-4"
								style={{
									backgroundColor: color,
								}}
							>
								<Text style={"copy"} size={18}>
									Drag A New Card Here!
								</Text>
							</div>
						)}
					</ul>
				</SortableContext>

				<SortableOverlay>
					{activeItem ? (
						<SortableItem
							color={color}
							id={id}
							className="box-border flex cursor-move list-none items-center rounded-lg px-3.5 py-4"
						>
							<Text style={"copy"} size={18}>
								{activeItem.response}
							</Text>
						</SortableItem>
					) : null}
				</SortableOverlay>
			</div>
		</DndContext>
	)
}
