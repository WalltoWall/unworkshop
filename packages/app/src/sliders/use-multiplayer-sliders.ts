import React from "react"
import { SlidersS } from "./schemas"
import { match } from "ts-pattern"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { noop } from "@/lib/noop"

export function useMultiplayerSliders() {
	const [answer, setAnswer] = React.useState<SlidersS.Answer>({})

	const { connecting, action, id } = useUnworkshopSocket({
		party: "sliders",
		type: "participant",
		onMessage: (msg) => {
			match(msg)
				.with({ type: "update" }, (msg) => setAnswer(msg.answer))
				.otherwise(noop)
		},
		schema: SlidersS.Message,
	})

	const actions = {
		change: (args: {
			type: SlidersS.AnswerType
			prompt: string
			value: number
		}) => {
			return action({ type: "change", payload: { id, ...args } })
		},
	}

	return { answer, actions, connecting }
}
