import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import type { SlidersS } from "../schemas"

export function usePresenterSliders() {
	const { connecting, state } = useUnworkshopSocket<SlidersS.Shape>({
		type: "presenter",
		shape: { groupAnswers: {} },
	})

	return { answers: state.groupAnswers, connecting }
}
