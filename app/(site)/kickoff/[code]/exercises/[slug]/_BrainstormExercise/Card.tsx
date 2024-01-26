import React from "react"
import clsx from "clsx"
import { XCircleIcon } from "@/components/icons/XCircle"
import type { BrainstormCard, BrainstormCardActions } from "./types"

type Props = {
	card: BrainstormCard
	colorClassNames: string
	deleteCard: BrainstormCardActions["deleteCard"]
	editCard: BrainstormCardActions["editCard"]
	participantId: string
}

export const Card = ({
	card,
	colorClassNames,
	deleteCard,
	editCard,
	participantId,
}: Props) => {
	return (
		<div className="relative aspect-[163/187]">
			<textarea
				className={clsx(
					colorClassNames,
					"h-full w-full resize-none rounded-lg p-3.5 placeholder:text-18 placeholder:leading-[1.25] focus:outline-none",
				)}
				placeholder="Type something here to add your perception"
				defaultValue={card.response}
				name="response"
				onChange={(e) =>
					editCard({
						cardId: card.id,
						participantId,
						response: e.currentTarget.value,
					})
				}
			/>

			<div className="absolute bottom-2 right-1.5 rounded-full">
				<button
					type="submit"
					onClick={() => deleteCard({ cardId: card.id, participantId })}
				>
					<XCircleIcon className="h-6 w-6" />
				</button>
			</div>
		</div>
	)
}
