"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import clsx from "clsx"
import { Chevron } from "@/components/icons/Chevron"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Cursors } from "@/components/Multiplayer/Cursors"
import { Text } from "@/components/Text"
import type { BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { useMultiplayerBrainstorm } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/use-multiplayer-brainstorm"
import { CardColumn } from "./CardColumn"
import { SORTING_COLUMN_ID } from "./constants"

type Props = { exercise: BrainstormExercise }

export const BrainstormPresenterViewClient = ({ exercise }: Props) => {
	const [showSorter, setShowSorter] = React.useState(true)
	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const { actions, multiplayer, snap } = useMultiplayerBrainstorm({
		exerciseId: exercise._id,
		stepIdx,
	})

	const stepData = snap.steps.at(stepIdx)
	if (!stepData) return null

	const columns = stepData.columns
	const unsorted = stepData.unsorted

	return (
		<DragDropContext
			onDragEnd={(result) => {
				const { source, destination } = result

				// We're dropping the card into a non-droppable place, e.g. off
				// of the screen.
				if (!destination) return

				actions.moveCard({
					from: { columnId: source.droppableId, idx: source.index },
					to: { columnId: destination.droppableId, idx: destination.index },
				})

				multiplayer.clearIntent()
			}}
			onDragStart={(result) => multiplayer.signalIntent(result.draggableId)}
		>
			<div className="relative">
				<div className="w-full rounded-2xl bg-gray-90 px-4 py-5">
					<button
						className="flex w-fit items-center gap-3 rounded-lg border-2 border-gray-50 px-2.5 py-2"
						onClick={() => setShowSorter(!showSorter)}
						type="button"
					>
						<Text style="heading" size={16} className="text-gray-50">
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
									"-mx-4 -my-5 flex min-h-[187px] w-full gap-2 overflow-y-clip overflow-x-scroll px-4 pb-5 pt-8 scrollbar-hide",
									showSorter ? "block" : "hidden",
								)}
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{unsorted.map((card, idx) => {
									const otherUserFocusingCard = Array.from(
										multiplayer.users.entries(),
									)
										.filter(([id]) => id !== multiplayer.awareness.clientID)
										.map(([, user]) => user)
										.find((user) => user.intent === card.id)

									return (
										<Draggable index={idx} draggableId={card.id} key={card.id}>
											{(cardProvided, cardSnapshot) => (
												<div
													ref={cardProvided.innerRef}
													{...cardProvided.draggableProps}
													{...cardProvided.dragHandleProps}
													style={{
														...cardProvided.draggableProps.style,
														outlineColor: otherUserFocusingCard?.color,
													}}
													className={clsx(
														"box-border aspect-square w-[8.4375rem] min-w-[8.4375rem] list-none rounded-lg bg-white px-3 py-2",
														"outline outline-2 outline-offset-2 outline-transparent",
														cardSnapshot.isDragging &&
															"box-border flex !aspect-auto !h-[3.75rem] !min-w-[17.5rem] list-none items-center !py-2.5 opacity-50",
													)}
												>
													<p>{card.response}</p>
												</div>
											)}
										</Draggable>
									)
								})}

								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>

				<div className="flex flex-wrap gap-4 pt-5">
					{columns.map((col, idx) => (
						<CardColumn
							key={col.id}
							index={idx}
							column={col}
							columns={columns}
							actions={actions}
							multiplayer={multiplayer}
						/>
					))}

					<button
						className="ease flex h-fit w-[19.125rem] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4 transition hover:bg-gray-82"
						onClick={() => actions.addColumn()}
					>
						<GrayPlusCircleIcon className="w-6" />
						<Text style="heading" size={18} className="text-gray-38">
							Add New Column
						</Text>
					</button>
				</div>
			</div>

			<Cursors awareness={multiplayer.awareness} users={multiplayer.users} />
		</DragDropContext>
	)
}

export default BrainstormPresenterViewClient
