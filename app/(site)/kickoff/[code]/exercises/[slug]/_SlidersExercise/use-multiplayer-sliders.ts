import React from "react"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { ANSWERS_KEY } from "@/constants"
import { INITIAL_SLIDERS_ANSWERS } from "./constants"
import { type SlidersAnswers } from "./types"

export type UseMultiplayerSlidersArgs = {
	participantId: string
	slug: string
} & MultiplayerArgs
export type SliderActions = ReturnType<typeof useMultiplayerSliders>["actions"]

export const useMultiplayerSliders = ({
	participantId,
	slug,
	...args
}: UseMultiplayerSlidersArgs) => {
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(
		proxy<SlidersAnswers>(INITIAL_SLIDERS_ANSWERS),
	).current
	const snap = useSnapshot(state)

	// Kinda janky, but this is required to ensure data is persisted initially.
	React.useEffect(() => {
		let unbind: (() => void) | undefined = undefined

		// This function runs once we know a connection has been made to our
		// backend and we've checked that data exists in Sanity.
		const onSync = (isSynced: boolean) => {
			if (isSynced) {
				const initialState = yMap.toJSON() as SlidersAnswers
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

	const getSlider = () => {
		state.participants[participantId] ??= {}
		const participant = state.participants[participantId]
		participant[slug] ??= {}
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
	}

	return { snap, actions, multiplayer }
}
