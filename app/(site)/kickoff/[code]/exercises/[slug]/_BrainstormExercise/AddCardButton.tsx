import React from "react"
import clsx from "clsx"
import { PlusIcon } from "@/components/icons/Plus"
import type { BrainstormActions } from "./use-multiplayer-brainstorm"

type Props = {
	actions: BrainstormActions
	participantOrGroupId: string
	readOnly?: boolean
}

export const AddCardButton = ({
	actions,
	participantOrGroupId,
	readOnly = false,
}: Props) => {
	return (
		<button
			className={clsx(
				"flex aspect-[163/187] select-none flex-col items-center justify-center gap-3 rounded-md transition focus:outline-none",
				readOnly ? "cursor-not-allowed" : "hover:bg-gray-90 focus:bg-gray-90",
			)}
			onClick={() => {
				if (readOnly) return
				actions.addCard({
					participantOrGroupId: participantOrGroupId,
					response: "",
				})
			}}
			disabled={readOnly}
		>
			<PlusIcon className="h-7 w-7 text-black" />

			<span className="max-w-[5rem] text-14 leading-none font-sans">
				Add another perception
			</span>
		</button>
	)
}
