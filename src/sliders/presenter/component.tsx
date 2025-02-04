"use client"

import { toPlainText } from "next-sanity"
import * as R from "remeda"
import { Settings } from "@/components/SettingsMenu"
import { PRESENTER_ID } from "@/constants"
import { slugify } from "@/lib/slugify"
import { useStep } from "@/lib/use-step"
import type { Sliders } from "@/sanity/types.gen"
import { useMultiplayerSliders } from "../use-multiplayer-sliders"
import { DotsView } from "./dots-view"
import { Key } from "./key"
import { PresenterSteps } from "./steps"
import { useView } from "./use-view"

type Props = {
	steps: Sliders["steps"]
}

export const SlidersPresenterComponent = (props: Props) => {
	const [view, setView] = useView()
	const isDots = view === "dots"

	const [step] = useStep()
	const data = props.steps.at(step - 1)
	if (!data) throw new Error("No valid step data found.")

	const left = data.sliders.at(0)?.left ?? data.sliders.at(1)?.left
	const right = data.sliders.at(0)?.right ?? data.sliders.at(1)?.right
	if (!left) throw new Error("No valid 'left' slider value found.")
	if (!right) throw new Error("No valid 'right' slider value found.")

	const { state } = useMultiplayerSliders(PRESENTER_ID)
	const prompt = slugify(toPlainText(data.prompt))
	const answers = R.pipe(
		state.answers,
		R.values(),
		R.filter((v) => v !== undefined),
		R.map((answers) => answers[prompt]),
	)

	return (
		<div className="relative m-5 flex grow flex-col">
			<Key view={view} />

			{isDots ? <DotsView answers={answers} /> : <div>Bars</div>}

			<PresenterSteps
				left={left}
				right={right}
				numSteps={props.steps.length}
				className="mt-4"
			/>

			<Settings.Root className="mt-5 self-end">
				<Settings.Toggle
					checked={isDots}
					onCheckedChanged={(checked) => setView(checked ? "dots" : "bars")}
				>
					{isDots ? "Show Bars view" : "Show Dots View"}
				</Settings.Toggle>
			</Settings.Root>
		</div>
	)
}
