"use client"

import React from "react"
import clsx from "clsx"
import { uid } from "uid"
import { AddCardButton } from "./AddCardButton"
import { CardForm } from "./CardForm"
import type { Answer } from "./types"

export type CardDispatch = {
	type: "add" | "delete"
	payload: Answer
}

export type Color = "green" | "red" | "yellow"

type ColorVarient = {
	bgColor: string
}

interface CardScrollerProps {
	cards: Array<Answer>
	exerciseId: string
	group: boolean
	color?: Color
	step: number
}

export const CardScroller = ({
	cards,
	exerciseId,
	group,
	color = "green",
	step = 1,
}: CardScrollerProps) => {
	const [optimisticCards, cardsDispatch] = React.useOptimistic<
		Array<Answer>,
		CardDispatch
	>(cards, (state, action) => {
		if (action.type === "delete") {
			return state.filter((card) => card.id !== action.payload.id)
		} else {
			return [...state, action.payload]
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

	const addOptimisticCard = (id: string) => {
		cardsDispatch({ type: "add", payload: { id, response: "" } })
	}

	const deleteOptimisticCard = (id: string) => {
		cardsDispatch({ type: "delete", payload: { id, response: "" } })
	}

	return (
		<div
			className={clsx(
				"relative mx-auto my-8 mb-auto grid max-h-[calc(100vh*0.62)] grow grid-cols-2 content-start gap-2.5 overflow-y-scroll py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:grid-cols-[163px_163px]",
			)}
		>
			<AddCardButton
				exerciseId={exerciseId}
				isGroup={group}
				addOptimisticCard={addOptimisticCard}
				cardId={uid()}
				step={step}
			/>
			{optimisticCards.toReversed().map((card) => (
				<CardForm
					key={card.id}
					exerciseId={exerciseId}
					cardId={card.id}
					deleteOptimisticCard={deleteOptimisticCard}
					response={card.response}
					color={Colors[color].bgColor}
				/>
			))}
		</div>
	)
}
