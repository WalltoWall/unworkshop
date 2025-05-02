import { SlidersComponent } from "@/sliders/component"
import type * as TH from "@/type-helpers"
import { match } from "ts-pattern"
import { Steps } from "./steps"
import { BrainstormComponent } from "@/brainstorm/component"

type Props = {
	exercise: TH.Exercise
}

export const Exercise = (props: Props) => {
	const numSteps = props.exercise.steps.length

	return (
		<>
			<div className="grow flex flex-col">
				{match(props.exercise)
					.with({ type: "sliders" }, (e) => (
						<SlidersComponent steps={e.steps} />
					))
					.with({ type: "brainstorm" }, (e) => (
						<BrainstormComponent steps={e.steps} />
					))
					.exhaustive()}
			</div>

			<Steps steps={numSteps} />
		</>
	)
}
