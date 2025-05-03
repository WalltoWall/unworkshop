import React from "react"
import { Participant } from "@/participant"
import { useParams } from "@tanstack/react-router"
import { nanoid } from "nanoid"
import usePartySocket from "partysocket/react"
import { BrainstormS } from "./schemas"
import { match } from "ts-pattern"
import { noop } from "motion/react"

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
				.otherwise(noop)
		},
	})

	const actions = {
		submission: (args: { step: number; value: string }) => {
			const msg: BrainstormS.Message = {
				type: "submission",
				payload: {
					id,
					step: args.step,
					value: args.value,
				},
			}

			socket.send(JSON.stringify(msg))
		},
		edit: (args: { step: number; value: string; idx: number }) => {
			console.log("edit")
			const msg: BrainstormS.Message = {
				type: "edit",
				payload: {
					id,
					step: args.step,
					idx: args.idx,
					value: args.value,
				},
			}

			socket.send(JSON.stringify(msg))
		},
	}

	return { answer, actions, connecting: socket.readyState !== socket.OPEN }
}
