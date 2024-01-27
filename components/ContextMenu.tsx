"use client"

import * as Context from "@radix-ui/react-context-menu"
import React from "react"
import { flushSync } from "react-dom"
import {
	type DraggableProvided,
	type DraggableStateSnapshot,
} from "@hello-pangea/dnd"
import type { BrainstormCard } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
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
}

export const ContextMenu = ({
	card,
	color,
	cardProvided,
	cardSnapshot,
}: ContextMenuProps) => {
	const [readOnly, setReadOnly] = React.useState(true)
	const textAreaRef = React.useRef<HTMLTextAreaElement>(null)
	console.log(card)

	const handleEditItem = () => {
		flushSync(() => {
			setReadOnly(false)
		})
		textAreaRef.current?.focus()
	}

	const handleDeleteItem = () => {
		// TODO:
	}

	const handleReturnItem = () => {
		// TODO:
	}

	// when editing and moving card to another column it reverts back
	const finalizeEdit = (newResponse: string) => {
		setReadOnly(true)
		// TODO:
	}

	return (
		<Context.Root modal={false}>
			<Context.Trigger>
				<div
					className={
						"box-border flex list-none items-center rounded-lg px-3 py-2.5"
					}
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
						suppressHydrationWarning
						value={card.response}
						className="pointer-events-none h-full min-h-10 w-full resize-none bg-transparent scrollbar-hide focus:outline-none"
						readOnly={readOnly}
						ref={textAreaRef}
						onKeyDown={(e) => {
							if (e.key !== "Enter") return

							e.preventDefault()
							finalizeEdit(e.currentTarget.value)
						}}
						onBlur={(e) => finalizeEdit(e.currentTarget.value)}
					/>
				</div>
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
