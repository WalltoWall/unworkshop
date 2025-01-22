import { useSyncedStore } from "@syncedstore/react"
import React from "react"
import { syncedStore } from "@syncedstore/core"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { INITIAL_QUADRANTS_ANSWERS } from "./contants"
import type { Answer, QuadrantsAnswers } from "./types"

export type UseMultiplayerQuadrantsArgs = {
	participantId?: string
	groupSlug?: string
} & MultiplayerArgs
export type QuadrantsActions = ReturnType<
	typeof useMultiplayerQuadrants
>["actions"]

export const useMultiplayerQuadrants = ({
	participantId,
	groupSlug,
	...args
}: UseMultiplayerQuadrantsArgs) => {
	const multiplayer = useMultiplayer(args)
	const store = React.useMemo(
		() => syncedStore(INITIAL_QUADRANTS_ANSWERS, multiplayer.doc),
		[multiplayer.doc],
	)
	const state = useSyncedStore(store) as QuadrantsAnswers

	const getQuadrant = (slug: string) => {
		if (participantId) {
			const participantOrGroupId = groupSlug ?? participantId

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

		getAnswers: () => {
			let answers = null
			let role = null

			if (participantId) {
				const participantOrGroupId = groupSlug ?? participantId

				answers = state.participants[participantOrGroupId]

				if (groupSlug) {
					role = state.groups?.[groupSlug]?.[participantId]
				}
			}

			return { answers, role }
		},

		getAllAnswers: () => {
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

	return { state, actions, multiplayer }
}
