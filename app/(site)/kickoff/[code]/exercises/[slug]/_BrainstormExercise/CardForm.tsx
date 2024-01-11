"use client"

import React from "react"
import clsx from "clsx"
import { XCircleIcon } from "@/components/icons/XCircle"
import { removeCardAction, submitResponseAction } from "./actions"
import { useDebounce } from "./debounce"

interface CardFormProps {
	exerciseId: string
	cardId: string
	response: string
	color: string
	deleteOptimisticCard: (id: string) => void
}

// TODO: Placeholder should be editable by the exercise

export const CardForm = ({
	exerciseId,
	cardId,
	response = "",
	color,
	deleteOptimisticCard,
}: CardFormProps) => {
	const formRef = React.useRef<HTMLFormElement>(null)

	const submitForm = useDebounce(() => formRef.current?.requestSubmit(), 250)

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
					className="card-input h-full w-full resize-none bg-transparent pt-3.5 placeholder:text-gray-19 placeholder:text-18 placeholder:leading-[1.25] focus:outline-none"
					placeholder="Type something here to add your perception"
					defaultValue={response}
					onChange={(e) => {
						submitForm()
					}}
					name="response"
				/>
			</form>
			<form
				action={async (formData: FormData) => {
					deleteOptimisticCard(cardId)
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
