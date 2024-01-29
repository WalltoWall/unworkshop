import React from "react"
import { PlusIcon } from "@/components/icons/Plus"
import type { AddCardData } from "./types"

interface AddCardButton {
	cardId: string
	exerciseId: string
	isGroup: boolean
	addCard: ({ id, exerciseId, isGroup, step }: AddCardData) => void
	step: number
}

// TODO: Error handling for optimistic ui
export const AddCardButton = ({
	cardId,
	exerciseId,
	isGroup,
	addCard,
	step,
}: AddCardButton) => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				addCard({
					id: cardId,
					exerciseId: exerciseId,
					isGroup: isGroup,
					step: step,
				})
			}}
			className="flex flex-col items-center justify-center"
		>
			<button className="flex flex-col items-center justify-center gap-3">
				<PlusIcon className="h-7 w-7 text-black" />
				<span className="max-w-[5rem] text-14 leading-none font-sans">
					Add another perception
				</span>
			</button>
		</form>
	)
}
