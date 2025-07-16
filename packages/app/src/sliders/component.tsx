import { toPlainText } from "@portabletext/react"
import { getRouteApi } from "@tanstack/react-router"
import type * as ST from "@unworkshop/studio"
import { PortableText } from "@/components/portable-text"
import { slugifyPortableText } from "@/lib/slugify-portable-text"
import { DEFAULT_ANSWER } from "./constants"
import { RangeSlider } from "./range-slider"
import { SlidersS } from "./schemas"
import { useMultiplayerSliders } from "./use-multiplayer-sliders"

type Props = { steps: ST.Sliders["steps"] }

const route = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const SlidersComponent = (props: Props) => {
	const search = route.useSearch()
	const { answer, actions, connecting } = useMultiplayerSliders()

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const prompt = slugifyPortableText(stepData.prompt)

	function onRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
		const type = SlidersS.Type.parse(e.currentTarget.name)
		const value = e.currentTarget.valueAsNumber

		actions.change({
			prompt,
			type,
			value,
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
						const name: SlidersS.Type = idx === 0 ? "today" : "tomorrow"

						return (
							<RangeSlider
								key={toPlainText(s.prompt) + s.left + s.right}
								left={s.left}
								right={s.right}
								prompt={s.prompt}
								name={name}
								onChange={onRangeChange}
								value={answer?.[prompt]?.[name] ?? DEFAULT_ANSWER.today}
							/>
						)
					})}
			</div>
		</div>
	)
}
