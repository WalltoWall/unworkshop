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
import { useDebounce } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/debounce"
import { submitBoardAction } from "./actions"
import { CardColumn } from "./CardColumn"
import { SORTING_COLUMN_ID } from "./constants"
import { Draggable, SortableItem } from "./SortableItem"
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

export interface SubmitFormProps {
	action:
		| "Update Title"
		| "Update Color"
		| "Default"
		| "Delete Column"
		| "Create Column"
	color?: string
	columnId?: string
	newColumn?: Columns
}

export const BrainstormPresenterViewClient = ({
	exerciseSlug,
	presenterColumns,
}: PresenterViewProps) => {
	const [showSorter, setShowSorter] = React.useState(true)
	// const [activeCard, setActiveCard] = React.useState<Active | null>(null)
	// const activeItem = React.useMemo(() => {
	// 	for (const key in columns) {
	// 		if (columns[key].cards.find((card) => card.id === activeCard?.id)) {
	// 			return columns[key].cards.find((card) => card.id === activeCard?.id)
	// 		}
	// 	}
	// }, [activeCard, columns])

	const formRef = React.useRef<HTMLFormElement>(null)
	const [, startTransition] = React.useTransition()

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	const submitForm = ({
		action,
		color,
		columnId,
		newColumn,
	}: SubmitFormProps) => {
		if (!formRef.current) return

		const data = new FormData(formRef.current)
		let columns = Columns.parse(data.get("columns"))
		const columnTitle = ColumnTitle.parse(data.get("columnTitle"))
		const exerciseSlug = ExerciseSlug.parse(data.get("exerciseSlug"))

		console.log(columns)

		switch (action) {
			case "Update Color":
				if (!columnId || !color) return
				columns[columnId].color = color
				break
			case "Update Title":
				if (!columnId) return
				columns[columnId].title = columnTitle
				break
			case "Delete Column":
				if (!columnId) return
				columns = Object.fromEntries(
					Object.entries(presenterColumns).filter(([key]) => key !== columnId),
				)
				break
			case "Create Column":
				if (!newColumn) return
				columns[columnId!] = newColumn[columnId!]
				break
			default:
				break
		}

		console.log(columns)
		// startTransition(() => {
		// 	submitBoardAction({ columns, exerciseSlug })
		// })
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm({ action: "Update Title" })
	}

	return (
		<DndContext sensors={sensors}>
			<form onSubmit={handleSubmit} ref={formRef}>
				<input type="hidden" value={exerciseSlug.current} name="exerciseSlug" />
				<input
					type="hidden"
					value={JSON.stringify(presenterColumns)}
					name="columns"
				/>
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

						<div
							className={clsx(
								"flex w-full gap-2 overflow-x-scroll",
								showSorter ? "block" : "hidden",
							)}
						>
							{presenterColumns[SORTING_COLUMN_ID].cards.map((card) => (
								<SortableItem
									id={card.id}
									color={""}
									className="box-border aspect-square w-[135px] min-w-[135px] list-none rounded-lg bg-white px-3 py-2"
									key={card.id}
								>
									<Draggable
										response={card.response}
										className="h-full w-full cursor-move resize-none bg-transparent focus:outline-none"
									/>
								</SortableItem>
							))}
						</div>
					</div>

					<div className="flex flex-wrap gap-4 pt-5">
						{Object.entries(presenterColumns).map(
							([columnId, { cards, color, title }]) => {
								if (columnId === SORTING_COLUMN_ID) return

								return (
									<CardColumn
										key={columnId}
										cards={cards}
										colorHex={color}
										columnTitle={title}
										id={columnId}
										columns={presenterColumns}
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
										title: "",
										cards: [],
									},
								}

								submitForm({
									action: "Create Column",
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
		</DndContext>
	)
}
