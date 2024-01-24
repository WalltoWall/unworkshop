"use client"

import React from "react"
import clsx from "clsx"
import { uid } from "uid"
import { addCardAction } from "./actions"
import { AddCardButton } from "./AddCardButton"
import { CardForm } from "./CardForm"
import type { AddCardData, Answer, CardScrollerProps, Color } from "./types"

export type CardDispatch = {
	type: "add" | "delete"
	payload: Answer
}

type ColorVarient = {
	bgColor: string
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

	const addCard = async ({ id, exerciseId, isGroup, step }: AddCardData) => {
		cardsDispatch({ type: "add", payload: { id, response: "" } })
		await addCardAction({
			id: id,
			exerciseId: exerciseId,
			isGroup: isGroup,
			step: step,
		})
	}

	const deleteOptimisticCard = (id: string) => {
		cardsDispatch({ type: "delete", payload: { id, response: "" } })
	}

	return (
		<div
			className={clsx(
				"relative my-8 mb-auto grid max-h-[calc(100vh*0.62)] grow grid-cols-2 content-start gap-2.5 overflow-y-scroll py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:grid-cols-[163px_163px]",
			)}
		>
			<AddCardButton
				exerciseId={exerciseId}
				isGroup={group}
				addCard={addCard}
				cardId={uid()}
				step={step}
			/>
			{optimisticCards.length <= 0 ? (
				<button
					className={clsx(
						"block h-[187px] w-full animate-fadeIn rounded-lg p-3.5",
						Colors[color].bgColor,
					)}
					onClick={() =>
						addCard({
							id: uid(),
							exerciseId: exerciseId,
							isGroup: group,
							step: step,
						})
					}
				>
					<span className="text-gray-19 text-18 leading-[1.25]">
						Type something here to add your perception
					</span>
				</button>
			) : (
				optimisticCards
					.toReversed()
					.map((card) => (
						<CardForm
							key={card.id}
							exerciseId={exerciseId}
							cardId={card.id}
							deleteOptimisticCard={deleteOptimisticCard}
							response={card.response}
							color={Colors[color].bgColor}
						/>
					))
			)}
		</div>
	)
}
