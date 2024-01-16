"use client"

import * as Context from "@radix-ui/react-context-menu"
import React, { startTransition, type CSSProperties } from "react"
import { type DraggableProvided } from "@hello-pangea/dnd"
import { deleteParticipantAnswer } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/actions"
import type {
	Card,
	Columns,
} from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/BrainstormPresenterViewClient"
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
}

export const ContextMenu = ({
	columns,
	card,
	color,
	exerciseSlug,
	cardProvided,
}: ContextMenuProps) => {
	const [readOnly, setReadOnly] = React.useState(true)

	const handleReturnItem = () => {
		let fromColumnCards
		let fromColumnId

		for (const key in columns) {
			if (columns[key].cards.some((c) => c.id === card.id)) {
				fromColumnId = key
				fromColumnCards = columns[key].cards
				break
			}
		}

		if (!fromColumnId || !fromColumnCards) return

		const toColumnCards = columns["sorting"].cards
		const activeCard = fromColumnCards.find((c) => c.id === card.id)

		if (!activeCard) return

		toColumnCards.unshift(activeCard)
	}

	const handleEditItem = () => {
		setReadOnly(false)
	}

	const handleDeleteItem = () => {
		let fromColumnCards
		let fromColumnId

		for (const key in columns) {
			if (columns[key].cards.some((c) => c.id === card.id)) {
				fromColumnId = key
				fromColumnCards = columns[key].cards
				break
			}
		}

		if (!fromColumnId || !fromColumnCards) return

		// startTransition(() => {
		// 	deleteParticipantAnswer({ cardId: card.id, exerciseSlug: exerciseSlug })
		// })
	}

	const finalizeEdit = (newResponse: string) => {
		card.response = newResponse
		setReadOnly(true)

		// edit participants answer
	}

	const style: CSSProperties = {
		backgroundColor: color,
	}

	return (
		<Context.Root>
			<Context.Trigger>
				<li
					id={card.id}
					className={
						"box-border flex list-none items-center rounded-lg px-3 py-2.5"
					}
					ref={cardProvided.innerRef}
					{...cardProvided.draggableProps}
					{...cardProvided.dragHandleProps}
					style={{ ...style, ...cardProvided.draggableProps.style }}
				>
					<textarea
						suppressHydrationWarning
						defaultValue={card.response}
						className="pointer-events-none h-[40px] w-full resize-none bg-transparent scrollbar-hide focus:outline-none"
						readOnly={readOnly}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
								finalizeEdit(e.currentTarget.value)
							}
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
