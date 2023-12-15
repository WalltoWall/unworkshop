"use client"

import React from "react"
import { GrayPlusCircleIcon } from "@/components/icons/GrayPlusCircle"
import { Text } from "@/components/Text"
import { CardColumn } from "./CardColumn"

interface PresenterViewProps {
	columnCards: Array<string>
	cards: Array<string>
}

export const BrainstormPresenterViewClient = ({
	columnCards,
	cards,
}: PresenterViewProps) => {
	const [columns, addColumns] = React.useState([1])

	const [optimisticColumn, addOptimisticColumn] = React.useOptimistic<
		Array<number>,
		number
	>(columns, (state, newColumn) => {
		return [...state, newColumn]
	})

	return (
		<div>
			<div className="flex w-full gap-2 rounded-2xl bg-gray-90 px-4 py-5">
				{cards.map((card, idx) => (
					<div
						className="min-h-[135px] min-w-[135px] rounded-lg bg-white px-3 py-2"
						key={idx}
					>
						{card}
					</div>
				))}
			</div>

			<div className="flex gap-4 pt-5">
				{optimisticColumn.map((column, idx) => (
					<CardColumn cards={columnCards} key={idx} />
				))}

				<button
					className="flex h-fit w-[306px] items-center gap-2 rounded-2xl bg-gray-90 px-3.5 py-4"
					onClick={() => {
						addColumns([...columns, 1])
						addOptimisticColumn(1)
					}}
				>
					<GrayPlusCircleIcon className="w-6" />
					<Text style={"heading"} size={18} className="text-gray-38">
						Add Another Board
					</Text>
				</button>
			</div>
		</div>
	)
}
