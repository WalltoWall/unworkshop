import React from "react"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { DEFAULT_BUCKETS } from "./constants"
import type { BrainstormPresenterS } from "./schemas"

export type BrainstormPresenterActions = ReturnType<
	typeof usePresenterBrainstorm
>["actions"]

export function usePresenterBrainstorm() {
	const socket = useUnworkshopSocket<BrainstormPresenterS.Shape>({
		type: "presenter",
		shape: { columns: [], meta: {} },
	})

	const state = socket.state
	const actions = React.useMemo(
		() => ({
			addUnsortedColumn: () => {
				state.meta.buckets = (state.meta.buckets ?? DEFAULT_BUCKETS) + 1
			},
			deleteUnsortedColumn: () => {
				state.meta.buckets = (state.meta.buckets ?? DEFAULT_BUCKETS) - 1
			},
		}),
		[state],
	)

	return {
		connecting: socket.connecting,
		state,
		actions,
	}
}
