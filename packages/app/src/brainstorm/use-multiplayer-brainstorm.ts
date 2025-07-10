import { nanoid } from "nanoid"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import type { BrainstormS } from "./schemas"

export function useMultiplayerBrainstorm() {
	const { connecting, group, state } =
		useUnworkshopSocket<BrainstormS.AllAnswers>({
			party: "brainstorm",
			type: "participant",
		})

	function safeGetAnswer() {
		state.answers[group] ??= {}

		return state.answers[group]
	}

	const actions = {
		add: (args: { step: number }) => {
			const answer = safeGetAnswer()

			answer[args.step] ??= []
			answer[args.step]?.push({ id: nanoid(6), value: "" })
		},
		edit: (args: { step: number; value: string; id: string }) => {
			const answer = safeGetAnswer()

			const sticky = answer[args.step]?.find((s) => s.id === args.id)
			if (!sticky) return

			sticky.value = args.value
		},
		delete: (args: { id: string; step: number }) => {
			const answer = safeGetAnswer()
			const idx = answer[args.step]?.findIndex((s) => s.id === args.id) ?? -1
			if (idx === -1) return

			answer[args.step]?.splice(idx, 1)
		},
	}

	return { answer: state.answers[group], actions, connecting, state }
}
