import React from "react"
import useYPartyKit from "y-partykit/react"
import { useUsers } from "y-presence"
import { env } from "@/env"
import { USER_COLORS } from "./colors"

export type MultiplayerArgs = {
	exerciseId: string
}

export type MultiplayerUser = {
	intent?: string
	color?: string
	point?: [x: number, y: number]
}

export type MultiplayerData = ReturnType<typeof useMultiplayer>

export const useMultiplayer = (args: MultiplayerArgs) => {
	const [synced, setSynced] = React.useState(false)
	const provider = useYPartyKit({
		host: env.NEXT_PUBLIC_PARTYKIT_HOST,
		room: `exercise::${args.exerciseId}`,
		options: { disableBc: env.NODE_ENV !== "production" },
	})

	const users = useUsers(provider.awareness)

	const signalIntent = React.useCallback(
		(intent: string) => {
			provider.awareness.setLocalStateField("intent", intent)
		},
		[provider.awareness],
	)

	const clearIntent = React.useCallback(() => {
		provider.awareness.setLocalStateField("intent", undefined)
	}, [provider.awareness])

	React.useEffect(() => {
		const randomColor =
			USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]

		provider.awareness.setLocalStateField("color", randomColor)
	}, [provider.awareness])

	React.useEffect(() => {
		const onSync = (status: boolean) => setSynced(status)
		provider.on("sync", onSync)

		return () => provider.off("sync", onSync)
	}, [provider])

	return {
		users: users as Map<number, MultiplayerUser>,
		provider,
		awareness: provider.awareness,
		doc: provider.doc,
		signalIntent,
		clearIntent,
		synced,
	}
}
