import { getYjsDoc, syncedStore } from "@syncedstore/core"
import { useSyncedStore } from "@syncedstore/react"
import { useParams } from "@tanstack/react-router"
import React from "react"
import { match } from "ts-pattern"
import useYProvider from "y-partyserver/react"
import { PRESENTER_GROUP_ID } from "@/constants"
import { Participant } from "@/participant"

type DocTypeDescription = {
	[key: string]: "xml" | "text" | Array<any> | object
}

type Args = {
	type: "participant" | "presenter"
}

export function useUnworkshopSocket<T extends DocTypeDescription>(args: Args) {
	const [connecting, setConnecting] = React.useState(true)
	const params = useParams({ strict: false })
	const participant = Participant.useInfo({
		assert: args.type === "participant",
	})
	const room = `${params.code}::${params.exerciseSlug}`

	const store = syncedStore({ answers: {} as T })
	const doc = getYjsDoc(store)
	const state = useSyncedStore(store)

	const provider = useYProvider({
		host: location.host,
		doc,
		room,
	})

	const group = match(args.type)
		.with("presenter", () => PRESENTER_GROUP_ID)
		.with("participant", () => params.groupSlug ?? participant!.id)
		.exhaustive()

	React.useEffect(() => {
		const onSync = (isSynced: boolean) => setConnecting(!isSynced)
		provider.on("sync", onSync)

		return () => provider.off("sync", onSync)
	}, [provider])

	return { connecting, group, state }
}
