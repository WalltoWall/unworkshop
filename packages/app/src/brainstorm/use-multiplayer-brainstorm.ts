import React from "react"
import { Participant } from "@/participant"
import { useParams } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import usePartySocket from "partysocket/react"
import { BrainstormS } from "./schemas"
import { match } from "ts-pattern"
import { noop } from "motion/react"

type CachedResolver = PromiseWithResolvers<unknown>

export function useMultiplayerBrainstorm() {
	const [answer, setAnswer] = React.useState<BrainstormS.Answer>({})
	const [cache] = React.useState(() => new Map<string, CachedResolver>())
	const participant = Participant.useInfoOrThrow()
	const params = useParams({ strict: false })

	const id = params.groupSlug ?? participant.id
	const room = `${params.code}::${params.exerciseSlug}`

	const socket = usePartySocket({
		host: window.location.host,
		party: "brainstorm",
		room,
		id: nanoid(8),
		query: { id },
		onMessage: (e) => {
			const data = JSON.parse(e.data)
			const event = BrainstormS.Message.parse(data)

			match(event)
				.with({ type: "init" }, (msg) => setAnswer(msg.answer))
				.with({ type: "update" }, (msg) => {
					const resolver = cache.get(msg.msgId)
					resolver?.resolve(null)

					setAnswer(msg.answer)
				})
				.otherwise(noop)
		},
	})

	const actionMessage = (msg: BrainstormS.Message) => {
		if (msg.type !== "submission" && msg.type !== "edit") return

		const resolver = Promise.withResolvers()
		cache.set(msg.msgId, resolver)

		setTimeout(() => {
			cache.delete(msg.msgId)
			resolver.reject(new Error("Socket message timed out."))
		}, 10000)

		socket.send(JSON.stringify(msg))

		return resolver.promise
	}

	const actions = {
		submission: (args: { step: number; value: string }) => {
			return actionMessage({
				type: "submission",
				msgId: nanoid(8),
				payload: {
					id,
					step: args.step,
					value: args.value,
				},
			})
		},
		edit: (args: { step: number; value: string; idx: number }) => {
			return actionMessage({
				type: "edit",
				msgId: nanoid(8),
				payload: {
					id,
					step: args.step,
					idx: args.idx,
					value: args.value,
				},
			})
		},
	}

	return { answer, actions, connecting: socket.readyState !== socket.OPEN }
}
