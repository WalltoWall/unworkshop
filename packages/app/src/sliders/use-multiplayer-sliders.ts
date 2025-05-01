import { Participant } from "@/participant"
import { useParams } from "@tanstack/react-router"
import usePartySocket from "partysocket/react"
import React from "react"
import { SlidersS } from "./schemas"
import { match } from "ts-pattern"
import { nanoid } from "nanoid"

export function useMultiplayerSliders() {
	const [answer, setAnswer] = React.useState<SlidersS.Answer>({})
	const participant = Participant.useInfoOrThrow()
	const params = useParams({ strict: false })

	const id = params.groupSlug ?? participant.id
	const room = `${params.code}::${params.exerciseSlug}`

	const socket = usePartySocket({
		host: window.location.host,
		party: "sliders",
		room,
		id: nanoid(8),
		query: { id },
		onMessage: (e) => {
			const data = JSON.parse(e.data)
			const event = SlidersS.Event.parse(data)

			match(event)
				.with({ type: "init" }, (msg) => setAnswer(msg.answer))
				.with({ type: "update" }, (msg) => setAnswer(msg.answer))
				.exhaustive()
		},
	})

	const actions = {
		changeAnswer: (args: {
			type: SlidersS.AnswerType
			prompt: string
			value: number
		}) => {
			const msg: SlidersS.Message = {
				type: "change",
				payload: {
					id,
					prompt: args.prompt,
					type: args.type,
					value: args.value,
				},
			}

			socket.send(JSON.stringify(msg))
		},
	}

	return { answer, actions, connecting: socket.readyState !== socket.OPEN }
}
