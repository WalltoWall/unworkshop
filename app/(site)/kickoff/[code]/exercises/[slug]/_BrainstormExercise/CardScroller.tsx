"use client"

import React from "react"
import clsx from "clsx"
import { AddCardButton } from "./AddCardButton"
import { CardForm } from "./CardForm"
import type { Answer } from "./types"

type Color = "green" | "red" | "yellow"

type ColorVarient = {
	bgColor: string
}

interface CardScrollerProps {
	cards: Array<Answer>
	exerciseId: string
	group: boolean
	color?: Color
}

export const CardScroller = ({
	cards,
	exerciseId,
	group,
	color = "green",
}: CardScrollerProps) => {
	const [optimisticCards, addOptimisticCard] = React.useOptimistic<
		Array<Answer>,
		Answer
	>(cards, (state, newCard) => {
		if (newCard.delete) {
			return state.filter((card) => card.id !== newCard.id)
		} else {
			return [...state, newCard]
		}
	})

	const Colors: Record<Color, ColorVarient> = {
		green: {
			bgColor: "bg-green-78",
		},
		red: {
			bgColor: "bg-pink-80",
		},
		yellow: {
			bgColor: "",
		},
	}

	return (
		<div
			className={clsx(
				"relative mx-auto my-8 grid max-h-full grow grid-cols-2 content-start gap-2.5 overflow-y-scroll py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:grid-cols-[163px_163px]",
			)}
		>
			<AddCardButton
				exerciseId={exerciseId}
				isGroup={group}
				addOptimisticCard={addOptimisticCard}
			/>
			{optimisticCards.reverse().map((card, idx) => (
				<CardForm
					key={idx}
					exerciseId={exerciseId}
					cardId={card.id}
					addOptimisticCard={addOptimisticCard}
					response={card.response}
					color={Colors[color].bgColor}
				/>
			))}
		</div>
	)
}
