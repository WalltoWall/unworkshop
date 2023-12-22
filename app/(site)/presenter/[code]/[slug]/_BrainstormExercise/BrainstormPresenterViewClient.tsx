"use client"

import React from "react"
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
	const [active, setActive] = React.useState<Active | null>(null)
	const [newColumnCards, setColumnCards] = React.useState(columnCards)
	const activeItem = React.useMemo(
		() => newColumnCards.find((card) => card.id === active?.id),
		[active, newColumnCards],
	)

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
		<DndContext
			sensors={sensors}
			onDragStart={({ active }) => {
				setActive(active)
			}}
			onDragEnd={({ active, over }) => {
				if (over && active.id !== over?.id) {
					const activeIndex = newColumnCards.findIndex(
						({ id }) => id === active.id,
					)
					const overIndex = newColumnCards.findIndex(({ id }) => id === over.id)

					setColumnCards(arrayMove(newColumnCards, activeIndex, overIndex))
				}

				setActive(null)
			}}
			onDragCancel={() => {
				setActive(null)
			}}
			onDragOver={({ active, over }) => {
				if (!over) return

				const initialContainer = active.data.current?.sortable?.containerId
				const targetContainer = active.data.current?.sortable.containerId

				if (!initialContainer) return
			}}
		>
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
					<div className="flex gap-4 pt-5">
						{optimisticColumn.map((column) => (
							<CardColumn
								key={column.columnId}
								cards={newColumnCards}
								id={column.columnId}
								removeColumn={removeColumn}
								activeItem={activeItem}
							/>
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
				</SortableContext>
			</div>
		</DndContext>
	)
}
