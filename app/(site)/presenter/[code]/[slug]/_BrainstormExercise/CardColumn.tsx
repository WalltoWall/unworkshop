"use client"

import React from "react"
import { CirclePicker } from "react-color"
import { Draggable, Droppable } from "@hello-pangea/dnd"
import debounce from "just-debounce-it"
import { ContextMenu } from "@/components/ContextMenu"
import { BlackXIcon } from "@/components/icons/BlackXIcon"
import { Popover } from "@/components/Popover"
import type { Columns } from "./BrainstormPresenterViewClient"
import type { ColumnsDispatch } from "./helpers"
import { PresentColumnModal } from "./PresentColumnModal"

interface CardColumnProps {
	cards: Array<{ response: string; id: string }>
	id: string
	colorHex: string
	columnTitle: string
	columns: Columns
	exerciseSlug: string
	submitFunction: (data: ColumnsDispatch) => void
	index: number
}

export const CardColumn = ({
	cards,
	colorHex,
	columnTitle,
	columns,
	id,
	exerciseSlug,
	submitFunction,
	index,
}: CardColumnProps) => {
	const [color, setColor] = React.useState<string>(colorHex || "#96fad1")

	const colorGroups = [
		"#FE9487",
		"#FE9E77",
		"#FFEE8A",
		"#96F7D0",
		"#A5AFFF",
		"#D59FF8",
		"#FFB7EF",
	]

	const debounceTitle = debounce(
		(title: string) =>
			submitFunction({
				type: "Update Title",
				columnId: id,
				columnTitle: title,
			}),
		2000,
	)

	return (
		<div className=" w-[306px] animate-fadeIn rounded-2xl bg-gray-90 px-2 py-3">
			<div className="flex items-center justify-between">
				<div className="relative flex items-center gap-2">
					<Popover
						trigger={
							<button
								className="h-5 w-5 rounded-full border border-black"
								style={{ backgroundColor: color }}
								type="button"
							/>
						}
						className="grid rounded-lg bg-black py-3 pl-3 pr-2"
						align="start"
						alignOffset={10}
						side="right"
					>
						<CirclePicker
							color={color}
							colors={colorGroups}
							circleSize={20}
							circleSpacing={16}
							width="7rem"
							onChange={(newColor) => {
								setColor(newColor.hex)
								submitFunction({
									type: "Update Color",
									color: newColor.hex,
									columnId: id,
								})
							}}
						/>
					</Popover>
					<input
						onChange={(e) => debounceTitle(e.currentTarget.value)}
						defaultValue={columnTitle}
						name="columnTitle"
						className="bg-transparent font-bold uppercase text-black outline-none ring-0 text-18 leading-[1.3125] font-heading"
					/>
				</div>
				<div className="flex items-center gap-3">
					<PresentColumnModal columns={columns} index={index} />
					<button
						onClick={() =>
							submitFunction({ type: "Delete Column", columnId: id })
						}
						type="button"
					>
						<BlackXIcon className="w-7" />
					</button>
				</div>
			</div>

			<Droppable droppableId={id} direction="vertical">
				{(provided) => (
					<ul
						className="mt-5 flex h-full min-h-[200px] w-full flex-col gap-2"
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{cards.length > 0 &&
							cards.map((card, idx) => (
								<Draggable index={idx} draggableId={card.id} key={card.id}>
									{(cardProvided, cardSnapshot) => (
										<ContextMenu
											columns={columns}
											card={card}
											color={color}
											exerciseSlug={exerciseSlug}
											cardProvided={cardProvided}
											submitForm={submitFunction}
											cardSnapshot={cardSnapshot}
										/>
									)}
								</Draggable>
							))}
						{provided.placeholder}
					</ul>
				)}
			</Droppable>
		</div>
	)
}
