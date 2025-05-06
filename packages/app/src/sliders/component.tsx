import React from "react"
import { toPlainText } from "@portabletext/react"
import { PortableText } from "@/components/portable-text"
import type * as ST from "@unworkshop/studio"
import { RangeSlider } from "./range-slider"
import { getRouteApi } from "@tanstack/react-router"
import { useMultiplayerSliders } from "./use-multiplayer-sliders"
import { SlidersS } from "./schemas"
import { slugifyPortableText } from "@/lib/slugify-portable-text"
import { DEFAULT_ANSWER } from "./constants"

type Props = { steps: ST.Sliders["steps"] }

const route = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const SlidersComponent = (props: Props) => {
	const search = route.useSearch()
	const { answer, actions, connecting } = useMultiplayerSliders()
	const [optAnswer, setOptAnswer] = React.useOptimistic(answer)

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const prompt = slugifyPortableText(stepData.prompt)

	async function onRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
		const type = SlidersS.AnswerType.parse(e.currentTarget.name)
		const value = e.currentTarget.valueAsNumber

		React.startTransition(async () => {
			setOptAnswer((p) => {
				const old = p[prompt] ?? DEFAULT_ANSWER

				return { ...p, [prompt]: { ...old, [type]: value } }
			})

			await actions.change({
				prompt,
				type,
				value,
			})
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
								value={optAnswer[prompt]?.[name] ?? DEFAULT_ANSWER.today}
							/>
						)
					})}
			</div>
		</div>
	)
}
