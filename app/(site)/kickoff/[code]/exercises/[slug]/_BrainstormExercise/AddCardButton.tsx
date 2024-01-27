import React from "react"
import { PlusIcon } from "@/components/icons/Plus"
import type { BrainstormActions } from "./use-multiplayer-brainstorm"

type Props = {
	actions: BrainstormActions
	participantId: string
}

export const AddCardButton = ({ actions, participantId }: Props) => {
	return (
		<button
			className="flex aspect-[163/187] select-none flex-col items-center justify-center gap-3 rounded-md transition hover:bg-gray-90 focus:bg-gray-90 focus:outline-none"
			onClick={() => actions.addCard({ participantId, response: "" })}
		>
			<PlusIcon className="h-7 w-7 text-black" />

			<span className="max-w-[5rem] text-14 leading-none font-sans">
				Add another perception
			</span>
		</button>
	)
}
