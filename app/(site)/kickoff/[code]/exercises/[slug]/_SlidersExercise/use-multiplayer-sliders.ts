import { useSyncedStore } from "@syncedstore/react"
import React from "react"
import { syncedStore } from "@syncedstore/core"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { INITIAL_SLIDERS_ANSWERS } from "./constants"
import { type SlidersAnswers } from "./types"

export type UseMultiplayerSlidersArgs = {
	participantId?: string
	slug: string
	groupSlug?: string
} & MultiplayerArgs
export type SliderActions = ReturnType<typeof useMultiplayerSliders>["actions"]

export const useMultiplayerSliders = ({
	participantId,
	slug,
	groupSlug,
	...args
}: UseMultiplayerSlidersArgs) => {
	const multiplayer = useMultiplayer(args)
	const store = React.useMemo(
		() => syncedStore(INITIAL_SLIDERS_ANSWERS, multiplayer.doc),
		[multiplayer.doc],
	)
	const state = useSyncedStore(store) as SlidersAnswers

	const getSlider = () => {
		const participantOrGroupId = groupSlug ?? participantId
		if (!participantOrGroupId)
			throw new Error("No valid group or participant ID was provided.")

		state.participants[participantOrGroupId] ??= {}
		const participant = state.participants[participantOrGroupId]

		participant[slug] ??= { today: 3, tomorrow: 3 }
		const step = participant[slug]

		return step
	}

	const actions = {
		setTodayValue: (args: { today: number }) => {
			const step = getSlider()

			step.today = args.today
		},
		setTomorrowValue: (args: { tomorrow: number }) => {
			const step = getSlider()

			step.tomorrow = args.tomorrow
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
	}

	return { state, actions, multiplayer }
}
