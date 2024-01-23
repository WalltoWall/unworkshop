"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { createClient } from "@sanity/client"
import clsx from "clsx"
import { debounce } from "perfect-debounce"
import { uid } from "uid"
import { Chevron } from "@/components/icons/Chevron"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Text } from "@/components/Text"
import {
	brainstormExerciseDataQuery,
	type BrainstormExerciseDataQueryResult,
} from "@/sanity/queries"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { env } from "@/env"
import { submitBoardAction } from "./actions"
import { CardColumn } from "./CardColumn"
import { SORTING_COLUMN_ID } from "./constants"
import {
	determineColumnState,
	move,
	reorder,
	type ColumnsDispatch,
} from "./helpers"

const client = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	token: env.NEXT_PUBLIC_SANITY_READ_TOKEN,
	useCdn: false,
})

export type Card = { response: string; id: string }

export type Columns = Array<Column>

export type Column = {
	color: string
	title: string
	cards: Array<Card>
	columnId: string
}

interface PresenterViewProps {
	exerciseId: string
	initialData: BrainstormExerciseDataQueryResult
}

const debounceSubmitBoard = debounce(submitBoardAction, 1500)

export const BrainstormPresenterViewClient = ({
	exerciseId,
	initialData,
}: PresenterViewProps) => {
	const [showSorter, setShowSorter] = React.useState(true)
	const formRef = React.useRef<HTMLFormElement>(null)
	const [, startTransition] = React.useTransition()
	const { exercise, participants } = initialData
	const router = useRouter()
	const routerDebounce = React.useMemo(
		() => debounce(() => router.refresh(), 500),
		[router],
	)

	React.useEffect(() => {
		const interval = setInterval(() => {
			routerDebounce()
		}, 10000)

		return () => clearInterval(interval)
	}, [routerDebounce])

	React.useEffect(() => {
		const subscription = client
			.listen<BrainstormExerciseDataQueryResult>(brainstormExerciseDataQuery, {
				exerciseId,
			})
			.subscribe((update) => {
				if (
					participants.some(
						(participant) => participant._id === update.documentId,
					)
				) {
					routerDebounce()
				}
			})

		return () => subscription.unsubscribe()
	}, [exerciseId, participants, routerDebounce])

	const participantAnswers = participants.flatMap(
		(participant) => participant.answers?.[exerciseId].answers,
	) as Array<Answer>

	const answerMap = new Map<string, string>()

	participantAnswers.forEach((answer) =>
		answerMap.set(answer.id, answer.response),
	)

	const answersWithResponses = exercise.answers?.map((column) => {
		const newCol: Column = {
			...column,
			cards: column.cards
				.map((cardId) => {
					if (!answerMap.has(cardId)) return null

					const response = answerMap.get(cardId)!

					const answer: Answer = {
						id: cardId,
						response: response,
					}

					answerMap.delete(cardId)

					return answer
				})
				.filter(Boolean) as Array<Answer>,
		}

		return newCol
	}) ?? [
		{
			columnId: SORTING_COLUMN_ID,
			title: "",
			color: "",
			cards: participantAnswers,
		},
	]

	const unsortedItems = Array.from(answerMap.entries()).map(
		([id, response]) => ({
			id,
			response,
		}),
	)

	answersWithResponses[0].cards.unshift(...unsortedItems.toReversed())

	const [optimisticColumns, setOptimisitColumns] =
		React.useOptimistic(answersWithResponses)

	const submitForm = async (action: ColumnsDispatch) => {
		const newColumns = determineColumnState(optimisticColumns, action)

		startTransition(async () => {
			setOptimisitColumns(newColumns)

			await debounceSubmitBoard({
				columns: newColumns,
				exerciseSlug: exercise.slug.current,
			})
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm({ type: "Default" })
	}

	const draggingStyles =
		"box-border flex list-none items-center !py-2.5 !aspect-auto !h-[3.75rem] !min-w-[17.5rem] opacity-50"

	return (
		<DragDropContext
			onDragEnd={(result) => {
				const { source, destination } = result

				if (!destination) return

				const fromColumnId = source.droppableId
				const toColumnId = destination.droppableId

				const fromCards = optimisticColumns.find(
					(col) => col.columnId === fromColumnId,
				)?.cards

				if (!fromCards) return

				if (fromColumnId === toColumnId) {
					const items = reorder({
						list: fromCards,
						startIndex: source.index,
						endIndex: destination.index,
					})

					submitForm({
						type: "Update Cards",
						columnId: fromColumnId,
						cards: items,
					})
				} else {
					const toCards =
						optimisticColumns.find((col) => col.columnId === toColumnId)
							?.cards ?? []
					const fromIdx = optimisticColumns.findIndex(
						(col) => col.columnId === fromColumnId,
					)
					const toIdx = optimisticColumns.findIndex(
						(col) => col.columnId === toColumnId,
					)

					const result = move({
						sourceCards: fromCards,
						destinationCards: toCards,
						sourceIndex: source.index,
						destinationIndex: destination.index,
					})

					const newColumns = structuredClone(optimisticColumns)

					newColumns[fromIdx].cards = result.fromCards
					newColumns[toIdx].cards = result.toCards

					submitForm({
						type: "Update Columns",
						replaceColumns: newColumns,
					})
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
							{(provided) => (
								<div
									className={clsx(
										"flex w-full gap-2 overflow-y-clip overflow-x-scroll scrollbar-hide",
										showSorter ? "block" : "hidden",
									)}
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									{optimisticColumns[0].cards.map((card, idx) => (
										<Draggable index={idx} draggableId={card.id} key={card.id}>
											{(cardProvided, cardSnapshot) => (
												<div
													ref={cardProvided.innerRef}
													{...cardProvided.draggableProps}
													{...cardProvided.dragHandleProps}
													className={clsx(
														"box-border aspect-square w-[8.4375rem] min-w-[8.4375rem] list-none rounded-lg bg-white px-3 py-2",
														cardSnapshot.isDragging && draggingStyles,
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
						{optimisticColumns.map((col, idx) => {
							if (col.columnId === SORTING_COLUMN_ID) return

							return (
								<CardColumn
									key={col.columnId}
									index={idx}
									cards={col.cards}
									colorHex={col.color}
									columnTitle={col.title}
									id={col.columnId}
									columns={optimisticColumns}
									exerciseSlug={exercise.slug.current}
									submitFunction={submitForm}
								/>
							)
						})}

						<button
							className="flex h-fit w-[19.125rem] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
							onClick={() => {
								const id = uid()

								const newColumn = {
									color: "",
									title: "New Column",
									cards: [],
									columnId: id,
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
