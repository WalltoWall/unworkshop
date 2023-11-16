"use client"

import React from "react"
import clsx from "clsx"
import { AddCardButton } from "./AddCardButton"
import { CardForm } from "./CardForm"
import type { Answer } from "./types"

interface CardScrollerProps {
	cards: Array<Answer>
	exerciseId: string
	group: boolean
}

export const CardScroller = ({
	cards,
	exerciseId,
	group,
}: CardScrollerProps) => {
	const [optimisticCards, addOptimisticCard] = React.useOptimistic<
		Array<Answer>,
		Answer
	>(cards, (state, newCard) => [...state, newCard])

	return (
		<div
			className={clsx(
				"scroll-shadow scroll-shadow-4 relative mx-auto my-8 grid max-h-full grow grid-cols-2 content-start gap-2.5 overflow-y-scroll py-4 scrollbar-hide sm:grid-cols-[163px_163px]",
			)}
		>
			<AddCardButton
				exerciseId={exerciseId}
				isGroup={group}
				addOptimisticCard={addOptimisticCard}
			/>
			{optimisticCards.reverse().map((card, idx) => (
				<CardForm key={idx} exerciseId={exerciseId} cardId={card.id} />
			))}
		</div>
	)
}
