import { AnimatePresence } from "motion/react"
import React from "react"
import clsx from "clsx"
import { Card } from "./Card"
import type { BrainstormCard, Color } from "./types"
import type { BrainstormActions } from "./use-multiplayer-brainstorm"

const colors: Record<Color, string> = {
	green: clsx("bg-green-78 placeholder:text-[color:#2b9a66]"),
	red: clsx("bg-pink-80 placeholder:text-[color:#e54666]"),
	yellow: clsx("bg-yellow-77 placeholder:text-[color:#9e6c00]"),
}

type Props = {
	cards: Array<BrainstormCard>
	color?: Color
	actions: BrainstormActions
	participantOrGroupId: string
	readOnly?: boolean
	placeholder?: string
	synced?: boolean
}

export const CardScroller = ({
	cards,
	color = "green",
	actions,
	participantOrGroupId,
	readOnly = false,
	placeholder,
	synced = false,
}: Props) => {
	React.useEffect(() => {
		console.info({ cards: cards.length, readOnly, synced })

		if (cards.length > 0 || readOnly || !synced) return

		actions.addCard({ response: "", participantOrGroupId })
	}, [participantOrGroupId, readOnly, cards.length, synced])

	return (
		<div className="mb-auto mt-4 grid min-h-0 flex-[1_1_0] grid-cols-2 content-start gap-2.5 overflow-y-auto py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:auto-rows-[10.25rem] sm:grid-cols-2">
			<AnimatePresence mode="popLayout">
				{cards.map((card) => (
					<Card
						key={card.id}
						card={card}
						colorClassNames={colors[color]}
						actions={actions}
						readOnly={readOnly}
						participantOrGroupId={participantOrGroupId}
						allowDelete={cards.length > 1}
						placeholder={placeholder}
					/>
				))}
			</AnimatePresence>
		</div>
	)
}
