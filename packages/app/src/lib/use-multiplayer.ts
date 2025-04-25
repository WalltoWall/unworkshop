import React from "react"
import useYPartyKit from "y-partykit/react"
import syncedStore from "@syncedstore/core"
import { env } from "@/env"

function getServerSnapshot() {
	return false
}

type Args = {
	/** The slug of the exercise. */
	slug: string

	/** The code of the kickoff. */
	code: string

	/** An identifier for this user. Usually the group slug or participant's ID. */
	id: string
}

export const useMultiplayer = <T>(args: Args) => {
	const provider = useYPartyKit({
		host: env.NEXT_PUBLIC_PARTYKIT_HOST,
		room: `${args.code}::${args.slug}`,
		options: { disableBc: env.NODE_ENV !== "production" },
	})

	const subscribe = React.useCallback(
		(cb: () => void) => {
			provider.on("sync", cb)

			return () => provider.off("sync", cb)
		},
		[provider],
	)
	const getSnapshot = React.useCallback(
		() => provider.synced,
		[provider.synced],
	)

	const synced = React.useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	)

	const store = React.useMemo(
		() => syncedStore({ answers: {} as Record<string, T> }, provider.doc),
		[provider.doc],
	)

	return {
		provider,
		store,
		synced,
	}
}
