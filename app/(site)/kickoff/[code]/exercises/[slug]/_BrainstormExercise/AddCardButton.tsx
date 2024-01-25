import React from "react"
import { PlusIcon } from "@/components/icons/Plus"
import type { BrainstormCardActions } from "./types"

interface AddCardButton {
	addCard: BrainstormCardActions["addCard"]
}

export const AddCardButton = ({ addCard }: AddCardButton) => {
	return (
		<button
			className="flex aspect-[163/187] select-none flex-col items-center justify-center gap-3 rounded-md transition hover:bg-gray-90 focus:bg-gray-90 focus:outline-none"
			onClick={() => addCard("")}
		>
			<PlusIcon className="h-7 w-7 text-black" />

			<span className="max-w-[5rem] text-14 leading-none font-sans">
				Add another perception
			</span>
		</button>
	)
}
