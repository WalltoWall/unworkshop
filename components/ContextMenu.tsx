"use client"

import * as Context from "@radix-ui/react-context-menu"
import React from "react"
import { flushSync } from "react-dom"
import {
	type DraggableProvided,
	type DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import type { BrainstormCard } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import type { BrainstormActions } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/use-multiplayer-brainstorm"
import { SORTING_COLUMN_ID } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/constants"
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
	card: BrainstormCard
	color: string
	cardProvided: DraggableProvided
	cardSnapshot: DraggableStateSnapshot
	actions: BrainstormActions
	idx: number
	columnId: string
}

export const ContextMenu = ({
	card,
	color,
	cardProvided,
	cardSnapshot,
	idx,
	actions,
	columnId,
}: ContextMenuProps) => {
	const [readOnly, setReadOnly] = React.useState(true)
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null)

	const enableEdits = () => {
		flushSync(() => setReadOnly(false))

		textAreaRef.current?.focus()
	}

	const disableEdits = () => setReadOnly(false)

	const returnToSorter = () => {
		actions.moveCard({
			from: { columnId: columnId, idx },
			to: { columnId: SORTING_COLUMN_ID, idx: 0 },
		})
	}

	return (
		<Context.Root modal={false}>
			<Context.Trigger>
				<div
					className="mt-2 box-border flex list-none items-center rounded-lg px-3 py-2.5"
					ref={cardProvided.innerRef}
					{...cardProvided.draggableProps}
					{...cardProvided.dragHandleProps}
					style={{
						...cardProvided.draggableProps.style,
						backgroundColor: color,
						opacity: cardSnapshot.isDragging ? "0.5" : "1",
					}}
				>
					<textarea
						value={card.response}
						className="pointer-events-none h-full min-h-10 w-full resize-none bg-transparent scrollbar-hide focus:outline-none"
						readOnly={readOnly}
						ref={textAreaRef}
						onKeyDown={(e) => {
							if (e.key === "Enter") disableEdits()
						}}
						onChange={(e) =>
							actions.editCard({ cardId: card.id, response: e.target.value })
						}
						onBlur={disableEdits}
					/>
				</div>
			</Context.Trigger>

			<Context.Portal>
				<Context.Content className="flex min-w-[120px] flex-col overflow-hidden rounded-lg bg-black py-1.5">
					<ContextMenuItem onClick={enableEdits}>Edit</ContextMenuItem>
					<ContextMenuItem onClick={returnToSorter}>
						Return to sorter
					</ContextMenuItem>
					<ContextMenuItem
						onClick={() => actions.deleteCard({ cardId: card.id })}
					>
						Delete
					</ContextMenuItem>
				</Context.Content>
			</Context.Portal>
		</Context.Root>
	)
}
