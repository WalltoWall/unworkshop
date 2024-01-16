"use client"

import React from "react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import clsx from "clsx"
import debounce from "just-debounce-it"
import { type Slug } from "sanity"
import { uid } from "uid"
import { Chevron } from "@/components/icons/Chevron"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Text } from "@/components/Text"
import { submitBoardAction } from "./actions"
import { CardColumn } from "./CardColumn"
import { SORTING_COLUMN_ID } from "./constants"
import {
	determineColumnState,
	move,
	reorder,
	type ColumnsDispatch,
} from "./helpers"
import {
	Color,
	ColumnId,
	Columns,
	ColumnTitle,
	ExerciseSlug,
} from "./validators"

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
	const [showSorter, setShowSorter] = React.useState(true)
	const formRef = React.useRef<HTMLFormElement>(null)
	const [, startTransition] = React.useTransition()

	const [optimisticColumns, setOptimisitColumns] =
		React.useOptimistic(presenterColumns)

	const submitForm = async (action: ColumnsDispatch) => {
		const newColumns = determineColumnState(optimisticColumns, action)

		startTransition(() => {
			setOptimisitColumns(newColumns)
			submitBoardAction({
				columns: newColumns,
				exerciseSlug: exerciseSlug.current,
			})
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm({ type: "Default" })
	}

	return (
		<DragDropContext
			onDragEnd={(result) => {
				const { source, destination } = result

				if (!destination) return

				const fromIndex = source.droppableId
				const toIndex = destination.droppableId

				if (fromIndex === toIndex) {
					const items = reorder({
						list: optimisticColumns[fromIndex].cards,
						startIndex: source.index,
						endIndex: destination.index,
					})

					submitForm({
						type: "Update Cards",
						changeIndex: fromIndex,
						cards: items,
					})
				} else {
					const result = move({
						sourceCards: optimisticColumns[fromIndex].cards,
						destinationCards: optimisticColumns[toIndex].cards,
						sourceIndex: source.index,
						destinationIndex: destination.index,
					})

					const newColumns: Columns = {
						...optimisticColumns,
						[fromIndex]: {
							...optimisticColumns[fromIndex],
							cards: result.fromCards,
						},
						[toIndex]: {
							...optimisticColumns[toIndex],
							cards: result.toCards,
						},
					}

					submitForm({ type: "Update Columns", newColumn: newColumns })
				}
			}}
		>
			<form onSubmit={handleSubmit} ref={formRef}>
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

						<Droppable droppableId={SORTING_COLUMN_ID} direction="horizontal">
							{(provided, snapshot) => (
								<div
									className={clsx(
										"flex w-full gap-2 overflow-y-clip overflow-x-scroll scrollbar-hide",
										showSorter ? "block" : "hidden",
									)}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{optimisticColumns[SORTING_COLUMN_ID].cards.map(
										(card, idx) => (
											<Draggable
												index={idx}
												draggableId={card.id}
												key={card.id}
											>
												{(cardProvided, cardSnapshot) => (
													<div
														className="box-border aspect-square w-[135px] min-w-[135px] list-none rounded-lg bg-white px-3 py-2"
														ref={cardProvided.innerRef}
														{...cardProvided.draggableProps}
														{...cardProvided.dragHandleProps}
													>
														<p>{card.response}</p>
													</div>
												)}
											</Draggable>
										),
									)}

									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</div>

					<div className="flex flex-wrap gap-4 pt-5">
						{Object.entries(optimisticColumns).map(
							([columnId, { cards, color, title }]) => {
								if (columnId === SORTING_COLUMN_ID) return

								return (
									<CardColumn
										key={columnId}
										cards={cards}
										colorHex={color}
										columnTitle={title}
										id={columnId}
										columns={optimisticColumns}
										exerciseSlug={exerciseSlug.current}
										submitFunction={submitForm}
									/>
								)
							},
						)}

						<button
							className="flex h-fit w-[306px] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
							onClick={() => {
								const id = uid()

								const newColumn = {
									[id]: {
										color: "",
										title: "New Column",
										cards: [],
									},
								}

								submitForm({
									type: "Create Column",
									newColumn: newColumn,
									columnId: id,
								})
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
		</DragDropContext>
	)
}
