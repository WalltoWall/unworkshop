import React from "react"
import { uid } from "uid"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { ANSWERS_KEY } from "@/constants"
import { type BrainstormAnswers, type BrainstormCardActions } from "./types"

type Args = { stepIdx: number } & MultiplayerArgs

export const useMultiplayerBrainstorm = ({ stepIdx, ...args }: Args) => {
	const multiplayer = useMultiplayer(args)

	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(
		proxy<BrainstormAnswers>({ steps: [{ participants: {}, groups: {} }] }),
	).current

	const snap = useSnapshot(state)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(() => bind(state, yMap), [])

	const getParticipant = (id: string) => {
		state.steps[stepIdx] ??= { groups: {}, participants: {} }

		const step = state.steps[stepIdx]
		const participants = step.participants

		participants[id] ??= { unsorted: [], columns: [] }
		const participant = participants[id]

		return participant
	}

	const actions: BrainstormCardActions = {
		addCard: (args) => {
			const participant = getParticipant(args.participantId)

			participant.unsorted.push({
				id: uid(),
				response: args.response,
				createdAt: Math.floor(new Date().getTime() / 1000),
			})
		},

		editCard: (args) => {
			const participant = getParticipant(args.participantId)

			const card =
				participant.unsorted.find((c) => c.id === args.cardId) ||
				participant.columns
					.flatMap((col) => col.cards)
					.find((c) => c.id === args.cardId)
			if (!card) return

			card.response = args.response
		},

		deleteCard: (args) => {
			const participant = getParticipant(args.participantId)

			const unsortedIdx = participant.unsorted.findIndex(
				(c) => c.id === args.cardId,
			)
			if (unsortedIdx >= 0) {
				participant.unsorted.splice(unsortedIdx, 1)

				return
			}

			const col = participant.columns.find((col) =>
				col.cards.some((card) => card.id === args.cardId),
			)
			if (!col) return

			const sortedIdx = col.cards.findIndex((card) => card.id === args.cardId)
			if (sortedIdx >= 0) {
				col.cards.splice(sortedIdx, 1)
			}
		},
	}

	return { snap, actions }
}
