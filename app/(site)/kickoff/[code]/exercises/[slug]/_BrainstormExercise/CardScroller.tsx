import React from "react"
import clsx from "clsx"
import { AddCardButton } from "./AddCardButton"
import { Card } from "./Card"
import type { BrainstormAnswer, BrainstormCardActions, Color } from "./types"

export type CardDispatch = {
	type: "add" | "delete"
	payload: BrainstormAnswer
	addCard: (response: string) => void
}

type ColorVarient = {
	bgColor: string
}

interface Props {
	cards: Array<BrainstormAnswer>
	color?: Color
	actions: BrainstormCardActions
}

export const CardScroller = ({ cards, color = "green", actions }: Props) => {
	const Colors: Record<Color, ColorVarient> = {
		green: { bgColor: "bg-green-78" },
		red: { bgColor: "bg-pink-80" },
		yellow: { bgColor: "" },
	}

	return (
		<div
			className={clsx(
				"my-8 mb-auto grid min-h-0 flex-[1_1_0] grid-cols-2 content-start gap-2.5 overflow-y-auto py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:grid-cols-[163px_163px]",
			)}
		>
			<AddCardButton addCard={actions.addCard} />

			{cards.toReversed().map((card) => (
				<Card
					key={card.id}
					cardId={card.id}
					response={card.response}
					color={Colors[color].bgColor}
					deleteCard={actions.deleteCard}
					editCard={actions.editCard}
				/>
			))}
		</div>
	)
}
