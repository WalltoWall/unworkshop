import React from "react"
import clsx from "clsx"
import { PlusIcon } from "@/components/icons/Plus"
import { showContributorWarning } from "@/lib/show-contributor-warning"
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
	function onClick() {
		console.log("here")
		if (readOnly) {
			showContributorWarning()

			return
		}

		console.log(participantOrGroupId)

		actions.addCard({
			participantOrGroupId: participantOrGroupId,
			response: "",
		})
	}

	return (
		<button
			className={clsx(
				"flex aspect-square h-full w-full select-none flex-col items-center justify-center gap-3 rounded-md transition focus:outline-none",
				readOnly
					? "cursor-not-allowed bg-gray-90 text-gray-50 shadow-inner"
					: "text-black hover:bg-gray-90 focus:bg-gray-90",
			)}
			onClick={onClick}
		>
			<PlusIcon className="h-7 w-7" />

			<span className="max-w-[5rem] text-14 leading-none font-sans">
				Add another perception
			</span>
		</button>
	)
}
