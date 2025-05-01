import { useParams } from "@tanstack/react-router"
import usePartySocket from "partysocket/react"
import React from "react"
import { SlidersS } from "../schemas"
import { match } from "ts-pattern"
import { PRESENTER_ID } from "@/constants"
import { nanoid } from "nanoid"

export function usePresenterSliders() {
	const [answers, setAnswers] = React.useState<SlidersS.AllAnswers>({})
	const params = useParams({ strict: false })

	const room = `${params.code}::${params.exerciseSlug}`

	const socket = usePartySocket({
		host: window.location.host,
		party: "sliders",
		room,
		id: nanoid(8),
		query: { id: PRESENTER_ID },
		onMessage: (e) => {
			const data = JSON.parse(e.data)
			const event = SlidersS.PresenterEvent.parse(data)

			match(event)
				.with({ type: "update" }, (msg) => setAnswers(msg.answers))
				.exhaustive()
		},
	})

	return { answers, connecting: socket.readyState !== socket.OPEN }
}
