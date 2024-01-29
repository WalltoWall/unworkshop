import React from "react"
import { uid } from "uid"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { SORTING_COLUMN_ID } from "@/app/(site)/presenter/[code]/[slug]/_BrainstormExercise/constants"
import { ANSWERS_KEY } from "@/constants"
import { INITIAL_ANSWERS } from "./constants"
import { type BrainstormAnswers } from "./types"

// TODO: Support groups via participantOrGroupId in args.

export type UseMultiplayerBrainstormArgs = { stepIdx: number } & MultiplayerArgs
export type BrainstormActions = ReturnType<
	typeof useMultiplayerBrainstorm
>["actions"]

export const useMultiplayerBrainstorm = ({
	stepIdx,
	...args
}: UseMultiplayerBrainstormArgs) => {
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(proxy<BrainstormAnswers>(INITIAL_ANSWERS)).current
	const snap = useSnapshot(state)

	// Kinda janky, but this is required to ensure data is persisted initially.
	React.useEffect(() => {
		let unbind: (() => void) | undefined = undefined

		// This function runs once we know a connection has been made to our
		// backend and we've checked that data exists in Sanity.
		multiplayer.doc.once("update", () => {
			if (multiplayer.provider.ws?.OPEN) {
				const initialState = yMap.toJSON() as BrainstormAnswers
				state.steps = initialState.steps

				unbind = bind(state, yMap)
			}
		})

		return () => unbind?.()
	}, [multiplayer.doc, yMap, multiplayer.provider.ws?.OPEN, state])

	const getStep = () => {
		state.steps[stepIdx] ??= { columns: [], unsorted: [] }
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
			const step = getStep()

			const columnIdx = step.columns.findIndex(
				(col) => col.id === args.columnId,
			)
			if (columnIdx < 0) return

			const column = step.columns.at(columnIdx)
			if (!column) return

			step.unsorted.push(...column.cards)

			// see: https://github.com/valtiojs/valtio-yjs/issues/28
			await Promise.resolve()

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

			const [card] = fromCards.splice(args.from.idx, 1)

			// see: https://github.com/valtiojs/valtio-yjs/issues/28
			await Promise.resolve()

			toCards.splice(args.to.idx, 0, card)
		},
	}

	return { snap, actions, multiplayer }
}
