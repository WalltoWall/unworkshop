import { toPlainText } from "@portabletext/react"
import { PortableText } from "@/components/portable-text"
import type * as ST from "@unworkshop/studio"
import { RangeSlider } from "./range-slider"
import { getRouteApi } from "@tanstack/react-router"
import { useMultiplayerSliders } from "./use-multiplayer-sliders"
import { SlidersS } from "./schemas"
import { slugifyPortableText } from "@/lib/slugify-portable-text"

type Props = { steps: ST.Sliders["steps"] }

const exerciseRoute = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const SlidersComponent = (props: Props) => {
	const search = exerciseRoute.useSearch()
	const { answer, actions, connecting } = useMultiplayerSliders()

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const prompt = slugifyPortableText(stepData.prompt)

	function onRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
		actions.changeAnswer({
			prompt,
			type: SlidersS.AnswerType.parse(e.currentTarget.name),
			value: e.currentTarget.valueAsNumber,
		})
	}

	return (
		<div className="space-y-3 py-3">
			<PortableText value={stepData.prompt} />

			<div className="flex flex-col gap-4">
				{connecting && (
					<div className="h-32 rounded-lg bg-neutral-200 animate-pulse" />
				)}

				{!connecting &&
					stepData.sliders.map((s, idx) => {
						const name: SlidersS.AnswerType = idx === 0 ? "today" : "tomorrow"

						return (
							<RangeSlider
								key={toPlainText(s.prompt) + s.left + s.right}
								left={s.left}
								right={s.right}
								prompt={s.prompt}
								name={name}
								onChange={onRangeChange}
								value={answer[prompt]?.[name] ?? 4}
							/>
						)
					})}
			</div>
		</div>
	)
}
