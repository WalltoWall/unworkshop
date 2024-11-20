import React from "react"
import clsx from "clsx"
import { motion } from "framer-motion"
import { showContributorWarning } from "@/lib/show-contributor-warning"
import type { BrainstormCard } from "./types"
import type { BrainstormActions } from "./use-multiplayer-brainstorm"

type Props = {
	card: BrainstormCard
	colorClassNames: string
	actions: BrainstormActions
	participantOrGroupId: string
	readOnly?: boolean
	allowDelete?: boolean
	placeholder?: string
}

export const Card = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			card,
			colorClassNames,
			actions,
			readOnly = false,
			participantOrGroupId,
			allowDelete = true,
			placeholder,
		},
		ref,
	) => {
		function onTextareaClick() {
			if (!readOnly) return

			showContributorWarning()
		}

		function deleteCard() {
			if (readOnly || !allowDelete) return

			actions.deleteCard({ cardId: card.id })
		}

		function spliceAddCard() {
			if (readOnly) return

			actions.spliceAddCard({
				participantOrGroupId,
				response: "",
				clickedCard: card,
			})
		}

		return (
			<motion.div
				className="relative aspect-square h-full w-full"
				layout="position"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				ref={ref}
			>
				<textarea
					className={clsx(
						colorClassNames,
						"h-full w-full resize-none rounded-lg p-3.5 placeholder:text-18 placeholder:leading-[1.25] focus:outline-none",
					)}
					placeholder={placeholder}
					value={card.response}
					readOnly={readOnly}
					name="response"
					onClick={onTextareaClick}
					onChange={(e) =>
						actions.editCard({ cardId: card.id, response: e.target.value })
					}
				/>

				{!readOnly && (
					<>
						{allowDelete && (
							<button
								type="submit"
								disabled={readOnly}
								onClick={deleteCard}
								className="absolute bottom-2 left-2.5 rounded-full"
							>
								<svg
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
							</button>
						)}

						<button
							type="submit"
							disabled={readOnly}
							onClick={spliceAddCard}
							className="absolute bottom-2 right-2.5 rounded-full"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
								<path
									fillRule="evenodd"
									d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
					</>
				)}
			</motion.div>
		)
	},
)
