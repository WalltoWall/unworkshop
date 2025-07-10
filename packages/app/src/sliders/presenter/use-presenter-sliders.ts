import { SlidersS } from "../schemas"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"

export function usePresenterSliders() {
	const { connecting, state } = useUnworkshopSocket<SlidersS.AllAnswers>({
		party: "sliders",
		type: "presenter",
	})

	return { answers: state.answers, connecting }
}
