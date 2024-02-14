import React from "react"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { INITIAL_FORM_ANSWERS } from "@/app/(site)/presenter/[code]/[slug]/_FormExercise/constants"
import { ANSWERS_KEY } from "@/constants"
import { type FormAnswers, type FormFieldAnswer } from "./types"

export type FormActions = ReturnType<typeof useMultiplayerForm>["actions"]

type Args = MultiplayerArgs & { participantId?: string }

export const useMultiplayerForm = ({ participantId, ...args }: Args) => {
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(proxy<FormAnswers>(INITIAL_FORM_ANSWERS)).current
	const snap = useSnapshot(state)

	// Kinda janky, but this is required to ensure data is persisted initially.
	React.useEffect(() => {
		let unbind: (() => void) | undefined = undefined

		// This function runs once we know a connection has been made to our
		// backend and we've checked that data exists in Sanity.
		const onSync = (isSynced: boolean) => {
			if (isSynced) {
				const initialState = yMap.toJSON() as FormAnswers
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

	const actions = {
		submitFieldAnswer: (args: {
			answer: FormFieldAnswer
			fieldIdx: number
			stepIdx: number
		}) => {
			if (!participantId) return

			state.participants[participantId] ??= []
			const participant = state.participants[participantId]

			participant[args.stepIdx] ??= []
			const step = participant[args.stepIdx]

			step[args.fieldIdx] = args.answer
		},
	}

	return { snap, actions, multiplayer }
}
