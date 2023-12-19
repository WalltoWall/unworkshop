"use client"

import React from "react"
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core"
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import clsx from "clsx"
import { uid } from "uid"
import { Chevron } from "@/components/icons/Chevron"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Text } from "@/components/Text"
import { CardColumn } from "./CardColumn"
import { Draggable, SortableItem } from "./SortableItem"

export type ColumnDispatch = {
	type: "add" | "delete"
	payload: { columnId: string }
}

interface PresenterViewProps {
	columnCards: Array<{ response: string; id: string }>
	cards: Array<{ response: string; id: string }>
}

export const BrainstormPresenterViewClient = ({
	columnCards,
	cards,
}: PresenterViewProps) => {
	const [columns, setColumns] = React.useState<Array<{ columnId: string }>>([
		{ columnId: "" },
	])

	const [showSorter, setShowSorter] = React.useState(true)

	const [optimisticColumn, addOptimisticColumn] = React.useOptimistic<
		Array<{ columnId: string }>,
		ColumnDispatch
	>(columns, (state, action) => {
		if (action.type === "delete") {
			return state.filter(
				(column) => column.columnId !== action.payload.columnId,
			)
		} else {
			return [...state, action.payload]
		}
	})

	const removeColumn = (id: string) => {
		setColumns(columns.filter((column) => column.columnId !== id))
		addOptimisticColumn({ type: "delete", payload: { columnId: id } })
	}

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	return (
		<DndContext sensors={sensors}>
			<div className="relative">
				<SortableContext items={cards}>
					<div className="flex w-full flex-col gap-3 rounded-2xl bg-gray-90 px-4 py-5">
						<button
							className="flex w-fit items-center gap-3 rounded-lg border-2 border-gray-50 px-2.5 py-2"
							onClick={() => setShowSorter(!showSorter)}
						>
							<Text style={"heading"} size={16} className="text-gray-50">
								Hide Sorter
							</Text>
							<Chevron
								className={clsx(
									"w-1.5 text-gray-50 transition duration-150 ease-in",
									showSorter ? "rotate-[270deg]" : "rotate-90",
								)}
							/>
						</button>
						<div
							className={clsx(
								"flex w-full gap-2",
								showSorter ? "block" : "hidden",
							)}
						>
							{cards.map((card) => (
								<SortableItem
									id={card.id}
									color={""}
									className="box-border aspect-square w-[135px] list-none rounded-lg bg-white px-3 py-2"
									key={card.id}
								>
									<Draggable response={card.response} />
								</SortableItem>
							))}
						</div>
					</div>
				</SortableContext>
				<div className="flex gap-4 pt-5">
					{optimisticColumn.map((column, idx) => (
						<SortableContext key={column.columnId} items={columnCards}>
							<CardColumn
								cards={columnCards}
								id={column.columnId}
								removeColumn={removeColumn}
							/>
						</SortableContext>
					))}

					<button
						className="flex h-fit w-[306px] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
						onClick={() => {
							const id = uid()
							setColumns([...columns, { columnId: id }])
							addOptimisticColumn({
								type: "add",
								payload: { columnId: id },
							})
						}}
					>
						<GrayPlusCircleIcon className="w-6" />
						<Text style={"heading"} size={18} className="text-gray-38">
							Add Another Board
						</Text>
					</button>
				</div>
			</div>
		</DndContext>
	)
}
