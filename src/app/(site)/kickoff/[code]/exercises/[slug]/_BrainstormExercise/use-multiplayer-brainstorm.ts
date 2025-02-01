import { useSyncedStore } from "@syncedstore/react"
import React from "react"
import { syncedStore } from "@syncedstore/core"
import * as R from "remeda"
import { uid } from "uid"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { SORTING_COLUMN_ID } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/constants"
import { INITIAL_BRAINSTORM_ANSWERS } from "./constants"
import { type BrainstormAnswers, type BrainstormCard } from "./types"

export type UseMultiplayerBrainstormArgs = {
	stepIdx: number
} & MultiplayerArgs
export type BrainstormActions = ReturnType<
	typeof useMultiplayerBrainstorm
>["actions"]

export const useMultiplayerBrainstorm = ({
	stepIdx,
	...args
}: UseMultiplayerBrainstormArgs) => {
	const multiplayer = useMultiplayer(args)
	const store = React.useMemo(
		() => syncedStore(INITIAL_BRAINSTORM_ANSWERS, multiplayer.doc),
		[multiplayer.doc],
	)
	const state = useSyncedStore(store) as BrainstormAnswers

	const getStep = () => {
		if (!state.steps[stepIdx]) {
			state.steps.splice(stepIdx, 0, { columns: [], unsorted: [] })
		}
		const step = state.steps[stepIdx]

		return step
	}

	const actions = {
		addCard: (args: { response: string; participantOrGroupId: string }) => {
			const step = getStep()

			step.unsorted.push({
				id: uid(),
				response: args.response,
				createdAt: Math.floor(new Date().getTime() / 1000),
				participantOrGroupId: args.participantOrGroupId,
			})
		},

		spliceAddCard: (args: {
			response: string
			participantOrGroupId: string
			clickedCard: BrainstormCard
		}) => {
			const step = getStep()

			step.unsorted.push({
				id: uid(),
				response: args.response,
				createdAt: args.clickedCard.createdAt + 1,
				participantOrGroupId: args.participantOrGroupId,
			})
		},

		editCard: (args: { cardId: string; response: string }) => {
			const step = getStep()

			const card =
				step.unsorted.find((c) => c.id === args.cardId) ||
				step.columns
					.flatMap((col) => col.cards)
					.find((c) => c.id === args.cardId)

			if (!card) return

			card.response = args.response
		},

		deleteCard: (args: { cardId: string }) => {
			const step = getStep()

			const unsortedIdx = step.unsorted.findIndex((c) => c.id === args.cardId)
			if (unsortedIdx >= 0) {
				step.unsorted.splice(unsortedIdx, 1)

				return
			}

			const col = step.columns.find((col) =>
				col.cards.some((card) => card.id === args.cardId),
			)
			if (!col) return

			const sortedIdx = col.cards.findIndex((card) => card.id === args.cardId)
			if (sortedIdx >= 0) {
				col.cards.splice(sortedIdx, 1)
			}
		},

		addColumn: () => {
			const step = getStep()

			step.columns.push({ cards: [], color: "#96F7D0", title: "", id: uid() })
		},

		editColumnTitle: (args: { title: string; columnId: string }) => {
			const step = getStep()

			const column = step.columns.find((col) => col.id === args.columnId)
			if (!column) return

			column.title = args.title
		},

		editColumnColor: (args: { color: string; columnId: string }) => {
			const step = getStep()

			const column = step.columns.find((col) => col.id === args.columnId)
			if (!column) return

			column.color = args.color
		},

		deleteColumn: async (args: { columnId: string }) => {
			const res = confirm(
				"Are you sure you want to delete this column? This will move all cards back into the sorter.",
			)
			if (!res) return

			const step = getStep()

			const columnIdx = step.columns.findIndex(
				(col) => col.id === args.columnId,
			)
			if (columnIdx < 0) return

			const column = R.clone(step.columns.at(columnIdx))
			if (!column) return

			step.unsorted.push(...column.cards)
			step.columns.splice(columnIdx, 1)
		},

		moveCard: async (args: {
			from: { columnId: string; idx: number }
			to: { columnId: string; idx: number }
		}) => {
			const step = getStep()

			const fromCards =
				args.from.columnId === SORTING_COLUMN_ID
					? step.unsorted
					: step.columns.find((col) => col.id === args.from.columnId)?.cards
			const toCards =
				args.to.columnId === SORTING_COLUMN_ID
					? step.unsorted
					: step.columns.find((col) => col.id === args.to.columnId)?.cards

			if (!fromCards || !toCards) return

			// Snapshot the card before removing it. We can't use the return value
			// from 'splice' since the reactive proxy sets it to be 'undefined' when
			// it is removed.
			const card = R.clone(fromCards.at(args.from.idx))
			fromCards.splice(args.from.idx, 1)

			// Add the card to our drag destination.
			if (card) toCards.splice(args.to.idx, 0, card)
		},
	}

	return { state, actions, multiplayer }
}
