import React from "react"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { ANSWERS_KEY } from "@/constants"
import { INITIAL_GROUP_ANSWERS } from "./constants"
import type { Role } from "./GroupForm"
import type { ExerciseAnswers } from "./types"

export type UseMultiplayerGroupsArgs = {
	participantId?: string
} & MultiplayerArgs
export type QuadrantsActions = ReturnType<
	typeof useMultiplayerGroups
>["actions"]

export const useMultiplayerGroups = ({
	participantId,
	...args
}: UseMultiplayerGroupsArgs) => {
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(
		proxy<ExerciseAnswers>(INITIAL_GROUP_ANSWERS),
	).current
	const snap = useSnapshot(state)

	React.useEffect(() => {
		let unbind: (() => void) | undefined = undefined

		// This function runs once we know a connection has been made to our
		// backend and we've checked that data exists in Sanity.
		const onSync = (isSynced: boolean) => {
			if (isSynced) {
				const initialState = yMap.toJSON() as ExerciseAnswers
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

	const actions = {
		setGroup: (args: { slug: string; role: Role }) => {
			if (participantId) {
				state.groups[args.slug] = {
					...state.groups[args.slug],
					[participantId]: args.role,
				}
			}
		},

		replaceCaptain: (args: { slug: string; captainId: string }) => {
			if (participantId) {
				state.groups[args.slug] = {
					...state.groups[args.slug],
					[args.captainId]: "contributor",
					[participantId]: "captain",
				}

				delete state?.participants?.[args.slug]
			}
		},
	}

	return { snap, actions }
}
