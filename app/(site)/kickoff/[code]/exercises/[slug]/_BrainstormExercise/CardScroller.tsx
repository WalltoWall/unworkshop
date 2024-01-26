import React from "react"
import clsx from "clsx"
import { AddCardButton } from "./AddCardButton"
import { Card } from "./Card"
import type {
	BrainstormAnswer,
	BrainstormCard,
	BrainstormCardActions,
	Color,
} from "./types"

export type CardDispatch = {
	type: "add" | "delete"
	payload: BrainstormAnswer
	addCard: (response: string) => void
}

const colors: Record<Color, string> = {
	green: clsx("bg-green-78 placeholder:text-[color:#2b9a66]"),
	red: clsx("bg-pink-80 placeholder:text-[color:#e54666]"),
	yellow: clsx("bg-yellow-77 placeholder:text-[color:#9e6c00]"),
}

type Props = {
	cards: Array<BrainstormCard>
	color?: Color
	actions: BrainstormCardActions
	participantId: string
}

export const CardScroller = ({
	cards,
	color = "green",
	actions,
	participantId,
}: Props) => {
	return (
		<div
			className={clsx(
				"my-8 mb-auto grid min-h-0 flex-[1_1_0] grid-cols-2 content-start gap-2.5 overflow-y-auto py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:grid-cols-[163px_163px]",
			)}
		>
			<AddCardButton addCard={actions.addCard} participantId={participantId} />

			{cards.map((card) => (
				<Card
					key={card.id}
					card={card}
					colorClassNames={colors[color]}
					deleteCard={actions.deleteCard}
					editCard={actions.editCard}
					participantId={participantId}
				/>
			))}
		</div>
	)
}
