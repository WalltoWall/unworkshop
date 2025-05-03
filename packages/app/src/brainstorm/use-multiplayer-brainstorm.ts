import { BrainstormS } from "./schemas"
import { match } from "ts-pattern"
import { noop } from "motion/react"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import React from "react"

export function useMultiplayerBrainstorm() {
	const [answer, setAnswer] = React.useState<BrainstormS.Answer>({})

	const { connecting, action, id } = useUnworkshopSocket({
		onMessage: (msg) => {
			match(msg)
				.with({ type: "init" }, (msg) => setAnswer(msg.answer))
				.with({ type: "update" }, (msg) => setAnswer(msg.answer))
				.otherwise(noop)
		},
		schema: BrainstormS.Message,
	})

	const actions = {
		submission: (args: { step: number; value: string }) => {
			return action({
				type: "submission",
				payload: {
					id,
					step: args.step,
					value: args.value,
				},
			})
		},

		edit: (args: { step: number; value: string; idx: number }) => {
			return action({
				type: "edit",
				payload: {
					id,
					step: args.step,
					idx: args.idx,
					value: args.value,
				},
			})
		},
	}

	return { answer, actions, connecting }
}
