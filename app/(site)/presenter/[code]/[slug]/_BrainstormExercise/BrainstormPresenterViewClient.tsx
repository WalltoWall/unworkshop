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
	payload: { columnId: string; cards: Array<{ id: string; response: string }> }
}

interface PresenterViewProps {
	columnCards: Array<{ response: string; id: string }>
	cards: Array<{ response: string; id: string }>
}

export const BrainstormPresenterViewClient = ({
	columnCards,
	cards,
}: PresenterViewProps) => {
	const [columns, setColumns] = React.useState<
		Array<{ columnId: string; cards: Array<{ id: string; response: string }> }>
	>([
		{
			columnId: "Sortable-1",
			cards: [
				{ id: "1", response: "Testing" },
				{ id: "2", response: "Testing moving" },
				{ id: "3", response: "Testing Again" },
			],
		},
	])

	const [showSorter, setShowSorter] = React.useState(true)
	const [active, setActive] = React.useState<Active | null>(null)
	const [newColumnCards, setColumnCards] = React.useState(columnCards)
	const activeItem = React.useMemo(
		() => newColumnCards.find((card) => card.id === active?.id),
		[active, newColumnCards],
	)

	const [optimisticColumn, addOptimisticColumn] = React.useOptimistic<
		Array<{ columnId: string; cards: Array<{ id: string; response: string }> }>,
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
		addOptimisticColumn({
			type: "delete",
			payload: { columnId: id, cards: [{ id: "", response: "" }] },
		})
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
				if (over && active.id !== over?.id && active.data.current) {
					if (
						active.data.current?.sortable.containerId !==
						over.data.current?.sortable.containerId
					)
						return

					const containerId = active.data.current.sortable.containerId

					const temp = columns.slice()
					const containerIdx = temp.findIndex(
						(column) => column.columnId === containerId,
					)
					const oldIdx = temp[containerIdx].cards.findIndex(
						(card) => card.id === active.id.toString(),
					)
					const newIdx = temp[containerIdx].cards.findIndex(
						(card) => card.id === over.id,
					)

					temp[containerIdx].cards = arrayMove(
						temp[containerIdx].cards,
						oldIdx,
						newIdx,
					)

					setColumns(temp)
				}

				setActive(null)
			}}
			onDragCancel={() => {
				setActive(null)
			}}
		>
			<div className="relative">
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
					{columns.map((column) => (
						<CardColumn
							key={column.columnId}
							cards={column.cards}
							id={column.columnId}
							removeColumn={removeColumn}
							activeItem={activeItem}
						/>
					))}

					<button
						className="flex h-fit w-[306px] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
						onClick={() => {
							const id = `Sortable-${columns.length + 1}`
							setColumns([
								...columns,
								{ columnId: id, cards: [{ id: "", response: "" }] },
							])
							addOptimisticColumn({
								type: "add",
								payload: { columnId: id, cards: [{ id: "", response: "" }] },
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
