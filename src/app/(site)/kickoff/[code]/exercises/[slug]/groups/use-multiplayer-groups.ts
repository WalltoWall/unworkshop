import { useSyncedStore } from "@syncedstore/react"
import React from "react"
import { syncedStore } from "@syncedstore/core"
import * as R from "remeda"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
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
	const store = React.useMemo(
		() => syncedStore(INITIAL_GROUP_ANSWERS, multiplayer.doc),
		[multiplayer.doc],
	)
	const state = useSyncedStore(store) as ExerciseAnswers

	const actions = {
		setRole: (args: { slug: string; role: Role }) => {
			if (!participantId) return

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

			state.groups[args.slug] ??= {}

			const group = state.groups[args.slug]
			const captain = R.pipe(
				R.entries(group),
				R.find(([, role]) => role === "captain"),
			)

			const captainId = captain?.[0]
			if (captainId) {
				state.groups[args.slug][captainId] = "contributor"
			}

			state.groups[args.slug][participantId] = "captain"
		},
	}

	return { state, actions, multiplayer }
}
