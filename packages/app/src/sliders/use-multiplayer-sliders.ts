import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { DEFAULT_ANSWER } from "./constants"
import type { SlidersS } from "./schemas"

export function useMultiplayerSliders() {
	const { connecting, group, state } = useUnworkshopSocket<SlidersS.Shape>({
		type: "participant",
		shape: { groupAnswers: {} },
	})

	const answer = state.groupAnswers[group]

	const actions = {
		change: (args: { type: SlidersS.Type; prompt: string; value: number }) => {
			state.groupAnswers[group] ??= {}

			state.groupAnswers[group][args.prompt] ??= DEFAULT_ANSWER
			const promptAnswer = state.groupAnswers[group][args.prompt]!

			if (args.type === "today") {
				promptAnswer.today = args.value
			} else {
				promptAnswer.tomorrow = args.value
			}
		},
	}

	return { answer, actions, connecting }
}
