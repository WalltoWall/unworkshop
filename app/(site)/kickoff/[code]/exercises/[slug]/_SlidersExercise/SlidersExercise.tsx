"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Slider } from "./Slider"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]
type Props = {
	exercise: ST["exercise"]
}

// TODO: Currently does not support nested sliders. E.g. 2 sliders per step.
// TODO: Ensure answers are persisted on refresh / page load.
// TODO: Tie the current step to search parameters.
export const SlidersExercise = ({ exercise }: Props) => {
	const router = useRouter()
	const params = useParams()

	const [value, setValue] = useState(0)
	const groups = exercise.groups ?? []
	const sliders = exercise.sliders ?? []

	const step = 1

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-8">
			{sliders.map((slider) => (
				<Slider
					key={slider._key}
					item={slider}
					exerciseId={exercise._id}
					group={groups.length > 0}
				/>
			))}

			<Steps steps={1} activeStep={step} onFinish={goBackToExerciseList} />
		</div>
	)
}
