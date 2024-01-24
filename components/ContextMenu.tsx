"use client"

import * as Context from "@radix-ui/react-context-menu"
import React, { startTransition, type CSSProperties } from "react"
import { flushSync } from "react-dom"
import {
	type DraggableProvided,
	type DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import {
	deleteParticipantAnswer,
	editParticipantAnswer,
} from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/actions"
import type {
	Card,
	Columns,
} from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/BrainstormPresenterViewClient"
import type { ColumnsDispatch } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/helpers"
import { Text } from "./Text"

const ContextMenuItem = ({
	children,
	onClick,
}: Context.ContextMenuItemProps) => {
	return (
		<Context.Item onClick={onClick}>
			<Text
				className="px-3 py-2 text-white hover:cursor-pointer hover:bg-yellow-58 hover:text-black"
				style={"contextMenu"}
				size={14}
				trim
			>
				{children}
			</Text>
		</Context.Item>
	)
}

interface ContextMenuProps extends React.ComponentPropsWithoutRef<"div"> {
	columns: Columns
	card: Card
	color: string
	exerciseSlug: string
	cardProvided: DraggableProvided
	submitForm: (data: ColumnsDispatch) => void
	cardSnapshot: DraggableStateSnapshot
}

export const ContextMenu = ({
	columns,
	card,
	color,
	exerciseSlug,
	cardProvided,
	submitForm,
	cardSnapshot,
}: ContextMenuProps) => {
	const [readOnly, setReadOnly] = React.useState(true)
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

	const handleReturnItem = () => {
		const fromColumn = columns.find((col) =>
			col.cards.find((c) => c.id === card.id),
		)

		if (!fromColumn) return

		const fromIdx = columns.findIndex(
			(col) => col.columnId === fromColumn.columnId,
		)

		const activeCard = fromColumn.cards.find((c) => c.id === card.id)

		const newFromCards = fromColumn.cards.filter((c) => c.id !== card.id)

		if (!activeCard) return

		const newColumns = structuredClone(columns)

		newColumns[fromIdx].cards = newFromCards
		newColumns[0].cards = [activeCard, ...columns[0].cards]

		submitForm({ type: "Update Columns", replaceColumns: newColumns })
	}

	const handleEditItem = () => {
		flushSync(() => {
			setReadOnly(false)
		})
		textAreaRef.current?.focus()
	}

	const handleDeleteItem = () => {
		const fromColumn = columns.find((col) =>
			col.cards.find((c) => c.id === card.id),
		)

		if (!fromColumn) return

		const fromIdx = columns.findIndex(
			(col) => col.columnId === fromColumn.columnId,
		)

		const newFromCards = fromColumn.cards.filter((c) => c.id !== card.id)

		const newColumns = structuredClone(columns)

		newColumns[fromIdx].cards = newFromCards

		submitForm({ type: "Update Columns", replaceColumns: newColumns })
		startTransition(() => {
			deleteParticipantAnswer({ cardId: card.id, exerciseSlug: exerciseSlug })
		})
	}

	// when editing and moving card to another column it reverts back
	const finalizeEdit = (newResponse: string) => {
		setReadOnly(true)

		startTransition(() => {
			editParticipantAnswer({ cardId: card.id, exerciseSlug, newResponse })
		})
	}

	const style: CSSProperties = {
		backgroundColor: color,
		opacity: cardSnapshot.isDragging ? "0.5" : "1",
	}

	return (
		<Context.Root modal={false}>
			<Context.Trigger>
				<li
					id={card.id}
					className={
						"box-border flex list-none items-center rounded-lg px-3 py-2.5"
					}
					ref={cardProvided.innerRef}
					{...cardProvided.draggableProps}
					{...cardProvided.dragHandleProps}
					style={{ ...cardProvided.draggableProps.style, ...style }}
				>
					<textarea
						suppressHydrationWarning
						defaultValue={card.response}
						className="pointer-events-none h-[40px] w-full resize-none bg-transparent scrollbar-hide focus:outline-none"
						readOnly={readOnly}
						ref={textAreaRef}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
								finalizeEdit(e.currentTarget.value)
							}
						}}
						onBlur={(e) => {
							finalizeEdit(e.currentTarget.value)
						}}
					/>
				</li>
			</Context.Trigger>

			<Context.Portal>
				<Context.Content className="flex min-w-[120px] flex-col overflow-hidden rounded-lg bg-black py-1.5">
					<ContextMenuItem onClick={() => handleEditItem()}>
						Edit
					</ContextMenuItem>
					<ContextMenuItem onClick={() => handleReturnItem()}>
						Return to sorter
					</ContextMenuItem>
					<ContextMenuItem onClick={() => handleDeleteItem()}>
						Delete
					</ContextMenuItem>
				</Context.Content>
			</Context.Portal>
		</Context.Root>
	)
}
