import React from "react"
import * as R from "remeda"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { ANSWERS_KEY } from "@/constants"
import { INITIAL_GROUP_ANSWERS } from "./constants"
import type { ExerciseAnswers, Role } from "./types"

export type UseMultiplayerGroupsArgs = {
	participantId?: string
} & MultiplayerArgs
export type QuadrantsActions = ReturnType<
	typeof useMultiplayerGroups
>["actions"]

// TODO: Consider passing in the group slug to the hook to prevent needing it in
// every action argument
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
		setRole: (args: { slug: string; role: Role }) => {
			if (!participantId) return

			state.groups ??= {}
			state.groups[args.slug] ??= {}

			// Remove this participant from all other groups first. Ensures
			// that a participant cannot be a member of multiple groups.
			R.forEachObj(state.groups, (group) =>
				R.keys(group).forEach((pId) => {
					if (pId === participantId) delete group[participantId]
				}),
			)

			// Then, set the participant to be a part of the group
			// they are "enrolling" into.
			state.groups[args.slug][participantId] = args.role
		},

		replaceCaptain: (args: { slug: string }) => {
			if (!participantId) return

			state.groups ??= {}
			state.groups[args.slug] ??= {}

			const group = state.groups[args.slug]
			const captain = R.pipe(
				R.entries(group),
				R.find(([_id, role]) => role === "captain"),
			)

			const captainId = captain?.[0]
			if (captainId) {
				state.groups[args.slug][captainId] = "contributor"
			}

			state.groups[args.slug][participantId] = "captain"
		},
	}

	return { snap, actions, multiplayer }
}
