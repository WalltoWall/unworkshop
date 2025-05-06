import { BrainstormS } from "./schemas"
import { match } from "ts-pattern"
import { noop } from "motion/react"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import React from "react"

export function useMultiplayerBrainstorm() {
	const [answer, setAnswer] = React.useState<BrainstormS.Answer>({})

	const { connecting, action, id } = useUnworkshopSocket({
		party: "brainstorm",
		type: "participant",
		onMessage: (msg) => {
			match(msg)
				.with({ type: "update" }, (msg) => setAnswer(msg.answer))
				.otherwise(noop)
		},
		schema: BrainstormS.Message,
	})

	const actions = {
		add: (args: { step: number }) => {
			return action({
				type: "add",
				payload: { id, step: args.step },
			})
		},

		edit: (args: { step: number; value: string; idx: number }) => {
			return action({
				type: "edit",
				payload: { id, ...args },
			})
		},

		delete: (args: { step: number; idx: number }) => {
			return action({
				type: "delete",
				payload: { id, ...args },
			})
		},
	}

	return { answer, actions, connecting }
}
