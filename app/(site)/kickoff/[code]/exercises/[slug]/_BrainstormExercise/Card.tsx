import React from "react"
import clsx from "clsx"
import { XCircleIcon } from "@/components/icons/XCircle"
import type { BrainstormCard } from "./types"
import type { BrainstormActions } from "./use-multiplayer-brainstorm"

type Props = {
	card: BrainstormCard
	colorClassNames: string
	actions: BrainstormActions
	readOnly?: boolean
}

export const Card = ({
	card,
	colorClassNames,
	actions,
	readOnly = false,
}: Props) => {
	return (
		<div className="relative aspect-[163/187]">
			<textarea
				className={clsx(
					colorClassNames,
					"h-full w-full resize-none rounded-lg p-3.5 placeholder:text-18 placeholder:leading-[1.25] focus:outline-none",
				)}
				placeholder="Type something here to add your perception"
				value={card.response}
				readOnly={readOnly}
				name="response"
				onChange={(e) =>
					actions.editCard({ cardId: card.id, response: e.target.value })
				}
			/>

			<div className="absolute bottom-2 right-1.5 rounded-full">
				<button
					type="submit"
					disabled={readOnly}
					onClick={() => {
						if (readOnly) return
						actions.deleteCard({ cardId: card.id })
					}}
				>
					<XCircleIcon className="h-6 w-6" />
				</button>
			</div>
		</div>
	)
}
