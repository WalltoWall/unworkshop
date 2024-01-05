"use client"

import React from "react"
import {
	closestCorners,
	DndContext,
	DragOverlay,
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
import { type Slug } from "sanity"
import { uid } from "uid"
import { Chevron } from "@/components/icons/Chevron"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Text } from "@/components/Text"
import { submitBoardAction } from "./actions"
import { CardColumn } from "./CardColumn"
import { SORTING_COLUMN_ID } from "./constants"
import { Draggable, SortableItem } from "./SortableItem"

export type Card = { response: string; id: string }

export type Columns = Record<
	string,
	{ color: string; title: string; cards: Array<Card> }
>

interface PresenterViewProps {
	exerciseSlug: Slug
	presenterColumns: Columns
}

export const BrainstormPresenterViewClient = ({
	exerciseSlug,
	presenterColumns,
}: PresenterViewProps) => {
	const [columns, setColumns] = React.useState<Columns>(presenterColumns)

	const [showSorter, setShowSorter] = React.useState(true)
	const [activeCard, setActiveCard] = React.useState<Active | null>(null)
	const activeItem = React.useMemo(() => {
		for (const key in columns) {
			if (columns[key].cards.find((card) => card.id === activeCard?.id)) {
				return columns[key].cards.find((card) => card.id === activeCard?.id)
			}
		}
	}, [activeCard, columns])

	const formRef = React.useRef<HTMLFormElement>(null)

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
			collisionDetection={closestCorners}
			onDragStart={({ active }) => {
				if (!active) return

				setActiveCard(active)
			}}
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
				const cards = columns[columnId].cards

				const oldIdx = cards.findIndex((card) => card.id === active.id)
				const newIdx = cards.findIndex((card) => card.id === over.id)

				setColumns({
					...columns,
					[columnId]: {
						...columns[columnId],
						cards: arrayMove(cards, oldIdx, newIdx),
					},
				})

				// formRef.current?.requestSubmit()
				setActiveCard(null)
			}}
			onDragOver={({ active, over }) => {
				if (!over || !active.data.current) return

				const fromColumnId = active.data.current?.sortable.containerId
				const toColumnId = over.data.current?.sortable.containerId

				if (!fromColumnId || !toColumnId) return

				if (fromColumnId === toColumnId) return

				const fromCards = columns[fromColumnId].cards
				const toCards = columns[toColumnId].cards

				const activeCard = fromCards.find((card) => card.id === active.id)

				if (!activeCard) return

				if (toCards.length === 0) {
					toCards.push(activeCard)

					setColumns({
						...columns,
						[fromColumnId]: {
							...columns[fromColumnId],
							cards: fromCards.filter((card) => card.id !== active.id),
						},
						[toColumnId]: {
							...columns[toColumnId],
							cards: toCards,
						},
					})
				} else {
					setColumns({
						...columns,
						[fromColumnId]: {
							...columns[fromColumnId],
							cards: fromCards.filter((card) => card.id !== active.id),
						},
						[toColumnId]: {
							...columns[toColumnId],
							cards: toCards.toSpliced(
								over.data.current?.sortable.index,
								0,
								activeCard,
							),
						},
					})
				}

				formRef.current?.requestSubmit()
			}}
		>
			<form action={submitBoardAction} ref={formRef}>
				<input type="hidden" value={exerciseSlug.current} name="exerciseSlug" />
				<input type="hidden" value={JSON.stringify(columns)} name="columns" />
				<div className="relative">
					<div className="flex w-full flex-col gap-3 rounded-2xl bg-gray-90 px-4 py-5">
						<button
							className="flex w-fit items-center gap-3 rounded-lg border-2 border-gray-50 px-2.5 py-2"
							onClick={() => setShowSorter(!showSorter)}
							type="button"
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

						<SortableContext
							items={columns[SORTING_COLUMN_ID].cards}
							id={SORTING_COLUMN_ID}
						>
							<div
								className={clsx(
									"flex w-full gap-2",
									showSorter ? "block" : "hidden",
								)}
							>
								{columns[SORTING_COLUMN_ID].cards.map((card) => (
									<SortableItem
										id={card.id}
										color={""}
										className="box-border aspect-square w-[135px] list-none rounded-lg bg-white px-3 py-2"
										key={card.id}
									>
										<Draggable
											response={card.response}
											className="h-full w-full cursor-move resize-none bg-transparent focus:outline-none"
										/>
									</SortableItem>
								))}
							</div>
						</SortableContext>
					</div>

					<div className="flex flex-wrap gap-4 pt-5">
						{Object.entries(columns).map(
							([columnId, { cards, color, title }]) => {
								if (columnId === SORTING_COLUMN_ID) return

								return (
									<CardColumn
										key={columnId}
										cards={cards}
										colorHex={color}
										columnTitle={title}
										id={columnId}
										removeColumn={removeColumn}
										columns={columns}
										setColumns={setColumns}
										formRef={formRef}
									/>
								)
							},
						)}

						<button
							className="flex h-fit w-[306px] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
							onClick={() => {
								const id = uid()

								setColumns({
									...columns,
									[id]: {
										color: "",
										title: "New Column",
										cards: [],
									},
								})

								formRef.current?.requestSubmit()
							}}
							type="button"
						>
							<GrayPlusCircleIcon className="w-6" />
							<Text style={"heading"} size={18} className="text-gray-38">
								Add Another Board
							</Text>
						</button>
					</div>
				</div>
			</form>

			<DragOverlay>
				{activeItem ? (
					<div className="box-border flex cursor-move list-none items-center rounded-lg px-3.5 py-4">
						{activeItem.response}
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	)
}
