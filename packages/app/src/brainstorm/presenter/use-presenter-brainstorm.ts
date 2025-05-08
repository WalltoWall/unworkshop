import React from "react"
import { BrainstormS } from "../schemas"
import { match } from "ts-pattern"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { noop } from "@/lib/noop"
import { DEFAULT_PRESENTER_STATE } from "../constants"

export type BrainstormPresenterActions = ReturnType<
	typeof usePresenterBrainstorm
>["actions"]

export function usePresenterBrainstorm() {
	const [answers, setAnswers] = React.useState<BrainstormS.AllAnswers>({})
	const [state, setState] = React.useState<BrainstormS.PresenterState>(
		DEFAULT_PRESENTER_STATE,
	)
	const [oState, setOState] = React.useOptimistic(state)

	const { connecting, action } = useUnworkshopSocket({
		party: "brainstorm",
		type: "presenter",
		onMessage: (msg) => {
			match(msg)
				.with({ type: "presenter-all" }, (msg) => {
					setAnswers(msg.answers)
					setState(msg.state)
				})
				.with({ type: "update-presenter-state" }, (msg) => setState(msg.state))
				.with({ type: "update-presenter-answers" }, (msg) =>
					setAnswers(msg.answers),
				)
				.otherwise(noop)
		},
		schema: BrainstormS.Message,
	})

	const actions = {
		addUnsortedColumn: () => {
			React.startTransition(async () => {
				setOState({ ...oState, unsortedColumns: oState.unsortedColumns + 1 })
				await action({ type: "add-unsorted-column" })
			})
		},

		deleteUnsortedColumn: () => {
			React.startTransition(async () => {
				setOState({ ...oState, unsortedColumns: oState.unsortedColumns - 1 })
				await action({ type: "delete-unsorted-column" })
			})
		},
	}

	return { answers, connecting, state, actions }
}
