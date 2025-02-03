"use client"

import { toPlainText } from "next-sanity"
import { PortableText } from "@/components/portable-text"
import { useStep } from "@/lib/use-step"
import { Participant } from "@/participant"
import type * as ST from "@/sanity/types.gen"
import { RangeSlider } from "./range-slider"

type Props = {
	steps: ST.Sliders["steps"]
}

export const SlidersComponent = (props: Props) => {
	const participant = Participant.useInfo()
	const [step] = useStep()

	const data = props.steps.at(step - 1)
	if (!data) throw new Error("Something went wrong.")

	return (
		<div className="space-y-3">
			<PortableText value={data.prompt} />

			<div className="flex flex-col gap-4">
				{data.sliders.map((s) => (
					<RangeSlider
						key={toPlainText(s.prompt) + s.left + s.right}
						left={s.left}
						right={s.right}
						prompt={s.prompt}
					/>
				))}
			</div>
		</div>
	)
}
