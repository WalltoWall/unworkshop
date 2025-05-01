import { SlidersComponent } from "@/sliders/component"
import type * as TH from "@/type-helpers"
import { match } from "ts-pattern"
import { Steps } from "./steps"

type Props = {
	exercise: TH.Exercise
}

export const Exercise = (props: Props) => {
	const numSteps = match(props.exercise)
		.with({ type: "sliders" }, (e) => e.steps.length)
		.exhaustive()

	return (
		<>
			<div className="grow">
				{match(props.exercise)
					.with({ type: "sliders" }, (e) => (
						<SlidersComponent steps={e.steps} />
					))
					.exhaustive()}
			</div>

			<Steps steps={numSteps} />
		</>
	)
}
