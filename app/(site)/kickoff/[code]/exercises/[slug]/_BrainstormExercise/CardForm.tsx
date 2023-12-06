"use client"

import React from "react"
import clsx from "clsx"
import { XCircleIcon } from "@/components/icons/XCircle"
import { removeCardAction, submitResponseAction } from "./actions"
import type { Answer } from "./types"

interface CardFormProps {
	exerciseId: string
	cardId: string
	response: string
	color: string
	addOptimisticCard: (action: Answer) => void
}

export const CardForm = ({
	exerciseId,
	cardId,
	response = "",
	color,
	addOptimisticCard,
}: CardFormProps) => {
	const formRef = React.useRef<HTMLFormElement>(null)
	const [message, setMessage] = React.useState<string>(response)

	return (
		<div className="relative">
			<form
				action={submitResponseAction}
				ref={formRef}
				className={clsx(
					"h-[187px] animate-fadeIn rounded-lg p-3.5 scrollbar-hide",
					color,
				)}
			>
				<input type="hidden" value={exerciseId} name="exerciseId" />
				<input type="hidden" value={cardId} name="cardId" />
				<textarea
					className="card-input h-full w-full resize-none bg-transparent pt-3.5 placeholder:text-black placeholder:text-18 placeholder:leading-[1.25] focus:outline-none"
					placeholder="Type something here to add your perception"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					name="response"
					onKeyDown={(e) => {
						if (formRef.current === null) return

						if (e.key === "Enter") {
							formRef.current.requestSubmit()
						}
					}}
				/>
			</form>
			<form
				action={async (formData: FormData) => {
					addOptimisticCard({ id: cardId, response: "", delete: true })
					await removeCardAction(formData)
				}}
				className="absolute bottom-2 right-1.5"
			>
				<input type="hidden" value={exerciseId} name="exerciseId" />
				<input type="hidden" value={cardId} name="cardId" />
				<button type="submit">
					<XCircleIcon className="h-6 w-6" />
				</button>
			</form>
		</div>
	)
}
