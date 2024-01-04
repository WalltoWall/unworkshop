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

type Card = { response: string; id: string }

type Columns = Record<string, Array<Card>>

interface PresenterViewProps {
	cards: Array<Card>
}

export const BrainstormPresenterViewClient = ({
	cards,
}: PresenterViewProps) => {
	const [sortingId] = React.useState(uid())
	const [columns, setColumns] = React.useState<Columns>({
		[sortingId]: cards,
		[uid()]: [
			{ id: uid(), response: "Testing" },
			{ id: uid(), response: "Testing moving" },
			{ id: uid(), response: "Testing Again" },
		],
	})

	const [showSorter, setShowSorter] = React.useState(true)

	const removeColumn = (id: string) => {
		const newColumns = { ...columns }
		delete newColumns[id]
		setColumns(newColumns)
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
			onDragEnd={({ active, over }) => {
				if (!over) return
				if (active.id === over.id) return
				if (!active.data.current) return
				if (
					active.data.current?.sortable.containerId !==
					over.data.current?.sortable.containerId
				)
					return

				const columnId = active.data.current.sortable.containerId
				const cards = columns[columnId]

				const oldIdx = cards.findIndex((card) => card.id === active.id)
				const newIdx = cards.findIndex((card) => card.id === over.id)

				setColumns({
					...columns,
					[columnId]: arrayMove(cards, oldIdx, newIdx),
				})
			}}
			onDragOver={({ active, over }) => {
				if (!over || !active.data.current) return

				const fromColumnId = active.data.current?.sortable.containerId
				const toColumnId = over.data.current?.sortable.containerId

				if (!fromColumnId || !toColumnId) return

				if (fromColumnId === toColumnId) return

				const fromCards = columns[fromColumnId]
				const toCards = columns[toColumnId]

				const activeCard = fromCards.find((card) => card.id === active.id)

				if (!activeCard) return

				setColumns({
					...columns,
					[fromColumnId]: fromCards.filter((card) => card.id !== active.id),
					[toColumnId]: toCards.toSpliced(
						over.data.current?.sortable.index,
						0,
						activeCard,
					),
				})
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

					<SortableContext items={cards} id={sortingId}>
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
					</SortableContext>
				</div>

				<div className="flex gap-4 pt-5">
					{Object.entries(columns).map(([columnId, cards]) => {
						if (columnId === sortingId) return

						return (
							<CardColumn
								key={columnId}
								cards={cards}
								id={columnId}
								removeColumn={removeColumn}
							/>
						)
					})}

					<button
						className="flex h-fit w-[306px] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
						onClick={() => {
							const id = uid()

							setColumns({
								...columns,
								[id]: [
									{ id: uid(), response: "Testing" },
									{ id: uid(), response: "Testing 2" },
								],
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
