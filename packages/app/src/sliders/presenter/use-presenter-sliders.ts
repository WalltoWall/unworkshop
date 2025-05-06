import React from "react"
import { SlidersS } from "../schemas"
import { match } from "ts-pattern"
import { useUnworkshopSocket } from "@/lib/use-unworkshop-socket"
import { noop } from "@/lib/noop"

export function usePresenterSliders() {
	const [answers, setAnswers] = React.useState<SlidersS.AllAnswers>({})

	const { connecting } = useUnworkshopSocket({
		party: "sliders",
		type: "presenter",
		onMessage: (msg) => {
			match(msg)
				.with({ type: "presenter" }, (msg) => setAnswers(msg.answers))
				.otherwise(noop)
		},
		schema: SlidersS.Message,
	})

	return { answers, connecting }
}
