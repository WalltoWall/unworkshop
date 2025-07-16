import { getYjsDoc, syncedStore } from "@syncedstore/core"
import { useSyncedStore } from "@syncedstore/react"
import { useParams } from "@tanstack/react-router"
import React from "react"
import { match } from "ts-pattern"
import useYProvider from "y-partyserver/react"
import { PRESENTER_GROUP_ID } from "@/constants"
import { Participant } from "@/participant"

// This comes from the kebab-case version of the exported `PartyServer` class.
// See: @/src/worker/unworkshop-party.ts
const PARTY_NAME = "unworkshop-party"

type DocTypeDescription = {
	[key: string]: "xml" | "text" | Array<any> | object
}

type Args<T extends DocTypeDescription> = {
	type: "participant" | "presenter"
	shape: T
}

export function useUnworkshopSocket<T extends DocTypeDescription>(
	args: Args<T>,
) {
	const params = useParams({ strict: false })
	const participant = Participant.useInfo({
		assert: args.type === "participant",
	})
	const room = `${params.code}::${params.exerciseSlug}`

	// biome-ignore lint/correctness/useExhaustiveDependencies: We dont want consumers of the hook to be required to `useMemo` `shape`.
	const store = React.useMemo(() => syncedStore(args.shape), [])
	const doc = React.useMemo(() => getYjsDoc(store), [store])

	const state = useSyncedStore(store)
	const provider = useYProvider({
		host: location.host,
		doc,
		party: PARTY_NAME,
		room,
	})

	const group = match(args.type)
		.with("presenter", () => PRESENTER_GROUP_ID)
		.with("participant", () => params.groupSlug ?? participant!.id)
		.exhaustive()

	const subscribe = React.useCallback(
		(cb: () => void) => {
			provider.on("sync", cb)

			return () => provider.off("sync", cb)
		},
		[provider],
	)
	const getSnapshot = React.useCallback(() => provider.synced, [provider])

	const synced = React.useSyncExternalStore(subscribe, getSnapshot)

	return { connecting: !synced, group, state }
}
