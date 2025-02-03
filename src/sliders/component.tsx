"use client"

import { useSyncedStore } from "@syncedstore/react"
import { toPlainText } from "next-sanity"
import { z } from "zod"
import { PortableText } from "@/components/portable-text"
import { slugify } from "@/lib/slugify"
import { useExerciseParams } from "@/lib/use-exercise-params"
import { useMultiplayer } from "@/lib/use-multiplayer"
import { useStep } from "@/lib/use-step"
import { Participant } from "@/participant"
import type * as ST from "@/sanity/types.gen"
import { RangeSlider } from "./range-slider"
import type { SlidersAnswers } from "./types"

type Props = { steps: ST.Sliders["steps"] }

export const SlidersComponent = (props: Props) => {
	const participant = Participant.useInfoOrThrow()
	const params = useExerciseParams()
	const [step] = useStep()

	const id = params.group ?? participant.id
	const multiplayer = useMultiplayer<SlidersAnswers>({
		slug: params.slug,
		code: params.code,
		id,
	})
	const state = useSyncedStore(multiplayer.store)

	const stepData = props.steps.at(step - 1)

	if (!stepData) throw new Error("Something went wrong.")
	if (!multiplayer.synced) return null

	const prompt = slugify(toPlainText(stepData.prompt))
	const readOnly = params.group ? participant.role !== "captain" : false

	function onRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
		const val = e.currentTarget.valueAsNumber
		state.answers[id] ??= {}
		state.answers[id][prompt] ??= { first: 1 }

		const name = NameSchema.parse(e.currentTarget.name)

		state.answers[id][prompt][name] = val
	}

	return (
		<div className="space-y-3 py-3">
			<PortableText value={stepData.prompt} />

			<div className="flex flex-col gap-4">
				{stepData.sliders.map((s, idx) => (
					<RangeSlider
						key={toPlainText(s.prompt) + s.left + s.right}
						left={s.left}
						right={s.right}
						prompt={s.prompt}
						name={idx === 0 ? "first" : "second"}
						readOnly={readOnly}
						value={
							(idx === 0
								? state.answers[id]?.[prompt]?.first
								: state.answers[id]?.[prompt]?.second) ?? 1
						}
						onChange={onRangeChange}
					/>
				))}
			</div>
		</div>
	)
}

const NameSchema = z.union([z.literal("first"), z.literal("second")])
