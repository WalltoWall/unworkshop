"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { Chevron } from "@/components/icons/Chevron"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Text } from "@/components/Text"
import type { BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { useMultiplayerBrainstorm } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/use-multiplayer-brainstorm"
import { CardColumn } from "./CardColumn"
import { SORTING_COLUMN_ID } from "./constants"
import { move, swap } from "./helpers"

type Props = { exercise: BrainstormExercise }

export const BrainstormPresenterViewClient = ({ exercise }: Props) => {
	const [showSorter, setShowSorter] = React.useState(true)
	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const { actions, snap } = useMultiplayerBrainstorm({
		exerciseId: exercise._id,
		stepIdx,
	})

	const answers = Object.values(snap.steps.at(stepIdx)?.participants ?? {})

	const unsorted = answers.flatMap((a) => a.unsorted)
	const columns = answers.flatMap((a) => a.columns)

	return (
		<DragDropContext
			onDragEnd={(result) => {
				const { source, destination } = result

				if (!destination) return

				const fromColumnId = source.droppableId
				const toColumnId = destination.droppableId

				// TODO: Reordering items within the same column
				if (fromColumnId === toColumnId) {
					const items = swap({
						list: fromCards,
						startIdx: source.index,
						endIdx: destination.index,
					})

					return
				}

				// TODO: Moving card from one column to another

				const f = move({
					sourceCards: fromCards,
					destinationCards: toCards,
					sourceIndex: source.index,
					destinationIndex: destination.index,
				})
			}}
		>
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
						{(provided) => (
							<div
								className={clsx(
									"flex w-full gap-2 overflow-y-clip overflow-x-scroll scrollbar-hide",
									showSorter ? "block" : "hidden",
								)}
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{unsorted.map((card, idx) => (
									<Draggable index={idx} draggableId={card.id} key={card.id}>
										{(cardProvided, cardSnapshot) => (
											<div
												ref={cardProvided.innerRef}
												{...cardProvided.draggableProps}
												{...cardProvided.dragHandleProps}
												className={clsx(
													"box-border aspect-square w-[8.4375rem] min-w-[8.4375rem] list-none rounded-lg bg-white px-3 py-2",
													cardSnapshot.isDragging &&
														"box-border flex !aspect-auto !h-[3.75rem] !min-w-[17.5rem] list-none items-center !py-2.5 opacity-50",
												)}
											>
												<p>{card.response}</p>
											</div>
										)}
									</Draggable>
								))}

								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>

				<div className="flex flex-wrap gap-4 pt-5">
					{columns.map((col, idx) => {
						return (
							<CardColumn
								key={col.id}
								index={idx}
								cards={col.cards}
								colorHex={col.color}
								columnTitle={col.title}
								id={col.id}
							/>
						)
					})}

					<button
						className="flex h-fit w-[19.125rem] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
						onClick={() => actions.createColumn()}
					>
						<GrayPlusCircleIcon className="w-6" />
						<Text style={"heading"} size={18} className="text-gray-38">
							Add Another Board
						</Text>
					</button>
				</div>
			</div>
		</DragDropContext>
	)
}

export default BrainstormPresenterViewClient
