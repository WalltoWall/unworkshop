import { PRESENTER_GROUP_ID } from "@/constants"
import { Participant } from "@/participant"
import { useParams } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import usePartySocket from "partysocket/react"
import React from "react"
import { match } from "ts-pattern"
import { z } from "zod"

const DEFAULT_TIMEOUT = 10000

type CachedResolver = PromiseWithResolvers<unknown>
type Args<T> = {
	timeout?: number
	onMessage: (msg: T) => void
	schema: z.ZodType<T>
	party: "sliders" | "brainstorm"
	type: "presenter" | "participant"
}

export function useUnworkshopSocket<T>(args: Args<T>) {
	const [cache] = React.useState(() => new Map<string, CachedResolver>())
	const participant = Participant.useInfoOrThrow()
	const params = useParams({ strict: false })

	const group = match(args.type)
		.with("presenter", () => PRESENTER_GROUP_ID)
		.with("participant", () => params.groupSlug ?? participant.id)
		.exhaustive()
	const room = `${params.code}::${params.exerciseSlug}`

	const UnworkshopMsg = z.object({ data: args.schema, id: z.string() })

	const socket = usePartySocket({
		host: window.location.host,
		party: args.party,
		room,
		id: nanoid(6),
		query: { group },
		onMessage: (e) => {
			const raw = JSON.parse(e.data)
			const msg = UnworkshopMsg.parse(raw)

			const resolver = cache.get(msg.id)
			resolver?.resolve(null)

			args.onMessage(msg.data)
		},
	})

	const action = (data: T) => {
		const msg = { data, id: nanoid(6) }

		const resolver = Promise.withResolvers()
		cache.set(msg.id, resolver)

		setTimeout(() => {
			cache.delete(msg.id)
			resolver.reject(new Error("Socket message timed out."))
		}, args.timeout ?? DEFAULT_TIMEOUT)

		socket.send(JSON.stringify(msg))

		return resolver.promise
	}

	return {
		socket,
		action,
		connecting: socket.readyState !== socket.OPEN,
		id: group,
		room,
		participant,
	}
}
