"use client"

import React from "react"
import { SwatchesPicker } from "react-color"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import clsx from "clsx"
import { ContextMenu } from "@/components/ContextMenu"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { useDebounce } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/debounce"
import type { Columns, SubmitFormProps } from "./BrainstormPresenterViewClient"
import { PresentColumnModal } from "./PresentColumnModal"
import { Draggable, SortableItem } from "./SortableItem"

interface CardColumnProps {
	cards: Array<{ response: string; id: string }>
	id: string
	colorHex: string
	columnTitle: string
	columns: Columns
	exerciseSlug: string
	submitFunction: (data: SubmitFormProps) => void
}

export const CardColumn = ({
	cards,
	colorHex,
	columnTitle,
	columns,
	id,
	exerciseSlug,
	submitFunction,
}: CardColumnProps) => {
	const [color, setColor] = React.useState<string>(colorHex || "#96fad1")
	const [showPicker, setShowPicker] = React.useState(false)
	const { setNodeRef } = useDroppable({ id: id })

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

	const debounceTitle = useDebounce(
		() => submitFunction({ action: "Update Title", columnId: id }),
		300,
	)

	return (
		<div className=" w-[306px] animate-fadeIn rounded-2xl bg-gray-90 px-2 py-3">
			<div className="flex items-center justify-between">
				<div className="relative flex items-center gap-2">
					<input type="hidden" value={color} name="color" />
					<input type="hidden" value={id} name="columnId" />
					<SwatchesPicker
						colors={colorGroups}
						onChange={(newColor) => {
							setColor(newColor.hex)
							setShowPicker(false)
							submitFunction({
								action: "Update Color",
								color: newColor.hex,
								columnId: id,
							})
						}}
						className={clsx("absolute", showPicker ? "block" : "hidden")}
					/>
					<button
						className="h-5 w-5 rounded-full border border-black"
						style={{ backgroundColor: color }}
						onClick={() => setShowPicker(!showPicker)}
						type="button"
					></button>
					<input
						onChange={debounceTitle}
						defaultValue={columnTitle}
						name="columnTitle"
						className="mt-2 bg-transparent font-bold uppercase text-black outline-none ring-0 text-18 leading-[1.3125] font-heading"
					/>
				</div>
				<div className="flex items-center gap-3">
					<PresentColumnModal
						cards={cards}
						color={color}
						columnTitle={columnTitle}
					/>
					<button
						onClick={() =>
							submitFunction({ action: "Delete Column", columnId: id })
						}
						type="button"
					>
						<BlackXIcon className="w-7" />
					</button>
				</div>
			</div>

			<SortableContext items={cards} id={id}>
				<ul
					className="mt-5 flex h-full min-h-[200px] w-full flex-col gap-2"
					ref={setNodeRef}
				>
					{cards.length > 0 ? (
						cards.map((card) => (
							<ContextMenu
								key={card.id}
								columns={columns}
								card={card}
								color={color}
								exerciseSlug={exerciseSlug}
							/>
						))
					) : (
						// Need to have invisible card here when column has no cards
						// Because dnd-kit has an issue with dragging items into empty containers
						<SortableItem
							id=""
							className="invisible box-border flex cursor-move list-none items-center rounded-lg px-3 py-2"
						>
							<Draggable
								response={""}
								className="h-[40px] w-full cursor-move resize-none bg-transparent scrollbar-hide focus:outline-none"
							/>
						</SortableItem>
					)}
				</ul>
			</SortableContext>
		</div>
	)
}
