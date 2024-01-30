import React from "react"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { ANSWERS_KEY } from "@/constants"
import { INITIAL_QUADRANTS_ANSWERS } from "./contants"
import type { QuadrantsAnswers, QuadrantsParticipant } from "./types"

export type UseMultiplayerQuadrantsArgs = {
	participantId: string
} & MultiplayerArgs
export type QuadrantsActions = ReturnType<
	typeof useMultiplayerQuadrants
>["actions"]

export const useMultiplayerQuadrants = ({
	participantId,
	...args
}: UseMultiplayerQuadrantsArgs) => {
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(
		proxy<QuadrantsAnswers>(INITIAL_QUADRANTS_ANSWERS),
	).current
	const snap = useSnapshot(state)

	React.useEffect(() => {
		let unbind: (() => void) | undefined = undefined

		// This function runs once we know a connection has been made to our
		// backend and we've checked that data exists in Sanity.
		const onSync = (isSynced: boolean) => {
			if (isSynced) {
				const initialState = yMap.toJSON() as QuadrantsAnswers
				state.participants = initialState.participants

				unbind = bind(state, yMap)
			}
		}
		multiplayer.provider.on("sync", onSync)

		return () => {
			unbind?.()
			multiplayer.provider.off("sync", onSync)
		}
	}, [multiplayer.provider, state, yMap])

	const getQuadrant = (slug: string) => {
		state.participants[participantId] ??= {}
		const participant = state.participants[participantId]

		participant[slug] ??= {}
		const quadrant = participant[slug]
		return quadrant
	}

	const actions = {
		setPointValue: (args: {
			slug: string
			day: "today" | "tomorrow"
			top: number
			left: number
		}) => {
			const quadrant = getQuadrant(args.slug)

			quadrant[args.day] = {
				top: args.top,
				left: args.left,
			}
		},

		getAllAnswers: (args: { participants: Array<QuadrantsParticipant> }) => {
			return []
		},
	}

	return { snap, actions, multiplayer }
}
