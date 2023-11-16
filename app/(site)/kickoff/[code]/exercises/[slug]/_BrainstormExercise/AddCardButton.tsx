import React from "react"
import { PlusIcon } from "@/components/icons/Plus"
import { addCardAction } from "./actions"
import type { Answer } from "./types"

interface AddCardButton {
	exerciseId: string
	isGroup?: boolean
	addOptimisticCard: (action: Answer) => void
}

// TODO: Error handling for optimistic ui
export const AddCardButton = ({
	exerciseId,
	isGroup,
	addOptimisticCard,
}: AddCardButton) => {
	return (
		<form
			action={async (formData: FormData) => {
				addOptimisticCard({ id: "placeholder", response: "" })
				await addCardAction(formData)
			}}
			className="flex flex-col items-center justify-center"
		>
			<input type="hidden" value={exerciseId} name="exerciseId" />
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
