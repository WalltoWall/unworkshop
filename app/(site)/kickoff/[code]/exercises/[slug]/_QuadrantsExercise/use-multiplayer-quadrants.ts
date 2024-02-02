import React from "react"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { ANSWERS_KEY } from "@/constants"
import { INITIAL_QUADRANTS_ANSWERS } from "./contants"
import type { Answer, QuadrantsAnswers, QuadrantsParticipant } from "./types"

export type UseMultiplayerQuadrantsArgs = {
	participantId?: string
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
				state.groups = initialState.groups

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
		if (participantId) {
			const group = state.groups?.[participantId]

			const participantOrGroupId = group ? group.slug : participantId

			state.participants[participantOrGroupId] ??= {}
			const participant = state.participants[participantOrGroupId]

			participant[slug] ??= {}
			const quadrant = participant[slug]
			return quadrant
		}

		return null
	}

	const actions = {
		setPointValue: (args: {
			slug: string
			day: "today" | "tomorrow"
			top: number
			left: number
		}) => {
			const quadrant = getQuadrant(args.slug)

			if (quadrant) {
				quadrant[args.day] = {
					top: args.top,
					left: args.left,
				}
			}
		},

		getAllAnswers: (args: { participants: Array<QuadrantsParticipant> }) => {
			let allAnswers: { [key: string]: Array<Answer> } = {}

			const participantAnswers = Object.values(state.participants)

			allAnswers = participantAnswers.reduce(
				(group: typeof allAnswers, answer) => {
					const slugs = Object.keys(answer)
					slugs.forEach((slug) => {
						group[slug] = group[slug] ?? []
						group[slug].push(answer[slug])
					})

					return group
				},
				{},
			)

			return allAnswers
		},
	}

	return { snap, actions, multiplayer }
}
