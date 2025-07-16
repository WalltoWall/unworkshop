import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import type { SlidersS } from "../schemas"

export function usePresenterSliders() {
	const { connecting, state } = useUnworkshopSocket<SlidersS.AllAnswers>({
		type: "presenter",
	})

	return { answers: state.answers, connecting }
}
