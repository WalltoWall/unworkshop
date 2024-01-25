import React from "react"
import clsx from "clsx"
import { XCircleIcon } from "@/components/icons/XCircle"
import type { BrainstormCardActions } from "./types"

interface CardFormProps {
	cardId: string
	response: string
	color: string
	deleteCard: BrainstormCardActions["deleteCard"]
	editCard: BrainstormCardActions["editCard"]
}

export const Card = ({
	cardId,
	response = "",
	color,
	deleteCard,
	editCard,
}: CardFormProps) => {
	return (
		<div className="relative aspect-[163/187]">
			<textarea
				className={clsx(
					color,
					"h-full w-full resize-none rounded-lg p-3.5 placeholder:text-gray-19 placeholder:text-18 placeholder:leading-[1.25] focus:outline-none",
				)}
				placeholder="Type something here to add your perception"
				defaultValue={response}
				name="response"
				onChange={(e) => editCard(cardId, e.target.value)}
			/>

			<div className="absolute bottom-2 right-1.5 rounded-full">
				<button type="submit" onClick={() => deleteCard(cardId)}>
					<XCircleIcon className="h-6 w-6" />
				</button>
			</div>
		</div>
	)
}
