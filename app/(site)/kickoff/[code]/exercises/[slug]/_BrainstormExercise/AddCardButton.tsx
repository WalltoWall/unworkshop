import React from "react"
import { PlusIcon } from "@/components/icons/Plus"
import { addCardAction } from "./actions"

interface AddCardButton {
	cardId: string
	exerciseId: string
	isGroup?: boolean
	addOptimisticCard: (id: string) => void
	step: number
}

// TODO: Error handling for optimistic ui
export const AddCardButton = ({
	cardId,
	exerciseId,
	isGroup,
	addOptimisticCard,
	step,
}: AddCardButton) => {
	return (
		<form
			action={async (formData: FormData) => {
				addOptimisticCard(cardId)
				await addCardAction(formData)
			}}
			className="flex flex-col items-center justify-center"
		>
			<input type="hidden" value={cardId} name="cardId" />
			<input type="hidden" value={exerciseId} name="exerciseId" />
			<input type="hidden" value={step} name="step" />
			<input
				type="checkbox"
				defaultChecked={isGroup}
				name="isGroup"
				className="hidden"
			/>
			<button className="flex flex-col items-center justify-center gap-3">
				<PlusIcon className="h-7 w-7 text-black" />
				<span className="max-w-[5rem] text-14 leading-none font-sans">
					Add another perception
				</span>
			</button>
		</form>
	)
}
