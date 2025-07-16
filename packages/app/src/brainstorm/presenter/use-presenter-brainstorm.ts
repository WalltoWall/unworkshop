import type { BrainstormPresenterS } from "./schemas"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"

export type BrainstormPresenterActions = ReturnType<
	typeof usePresenterBrainstorm
>["actions"]

export function usePresenterBrainstorm() {
	const socket = useUnworkshopSocket<BrainstormPresenterS.State>({
		type: "presenter",
	})

	const state = socket.state.answers.state ?? { buckets: 5, columns: [] }
	const actions = {}

	return {
		connecting: socket.connecting,
		state,
		actions,
	}
}
