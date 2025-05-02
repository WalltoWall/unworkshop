import { Participant } from "@/participant"
import { useParams } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import usePartySocket from "partysocket/react"
import React from "react"
import { BrainstormS } from "./schemas"
import { match } from "ts-pattern"

export function useMultiplayerBrainstorm() {
	const [answer, setAnswer] = React.useState<BrainstormS.Answer>({})
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
				.with({ type: "answer" }, (msg) => setAnswer(msg.answer))
				.otherwise(() => {})
		},
	})

	const actions = {}

	return { answer, actions, connecting: socket.readyState !== socket.OPEN }
}
