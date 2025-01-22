import { useSyncedStore } from "@syncedstore/react"
import React from "react"
import syncedStore from "@syncedstore/core"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { INITIAL_FORM_ANSWERS } from "@/app/(site)/presenter/[code]/[slug]/_FormExercise/constants"
import { type FormAnswers, type FormFieldAnswer } from "./types"

export type FormActions = ReturnType<typeof useMultiplayerForm>["actions"]

type Args = MultiplayerArgs & { participantOrGroupId?: string }

export const useMultiplayerForm = ({ participantOrGroupId, ...args }: Args) => {
	const multiplayer = useMultiplayer(args)
	const store = React.useMemo(
		() => syncedStore(INITIAL_FORM_ANSWERS, multiplayer.doc),
		[multiplayer.doc],
	)
	const state = useSyncedStore(store) as FormAnswers

	const actions = {
		submitFieldAnswer: (args: {
			answer: FormFieldAnswer
			fieldIdx: number
			stepIdx: number
		}) => {
			if (!participantOrGroupId) return

			state.participants[participantOrGroupId] ??= []
			const participant = state.participants[participantOrGroupId]

			if (!participant[args.stepIdx]) {
				participant.splice(args.stepIdx, 0, [])
			}

			const step = participant[args.stepIdx]
			const delCount = Boolean(step[args.fieldIdx]) ? 1 : 0
			step.splice(args.fieldIdx, delCount, args.answer)
		},
	}

	return { state, actions, multiplayer }
}
