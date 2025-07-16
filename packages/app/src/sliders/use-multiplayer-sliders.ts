import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { DEFAULT_ANSWER } from "./constants"
import type { SlidersS } from "./schemas"

export function useMultiplayerSliders() {
	const { connecting, group, state } = useUnworkshopSocket<SlidersS.AllAnswers>(
		{ type: "participant" },
	)

	const answer = state.answers[group]

	const actions = {
		change: (args: {
			type: SlidersS.AnswerType
			prompt: string
			value: number
		}) => {
			state.answers[group] ??= {}

			state.answers[group][args.prompt] ??= DEFAULT_ANSWER
			const promptAnswer = state.answers[group][args.prompt]!

			if (args.type === "today") {
				promptAnswer.today = args.value
			} else {
				promptAnswer.tomorrow = args.value
			}
		},
	}

	return { answer, actions, connecting }
}
