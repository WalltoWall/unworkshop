import type { ST } from "@/sanity/config"
import { Slider } from "./Slider"
import { client } from "@/sanity/client"
import type { SlidersParticipant } from "./types"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]

type Props = {
	exercise: ST["exercise"]
}

export const SlidersExercise = async ({ exercise }: Props) => {
	const groups = exercise.groups ?? []
	const participant =
		await client.findParticipantOrThrow<SlidersParticipant>()
	const answers = participant.answers?.[exercise._id]?.answers ?? {}

	return (
		<div className="mt-8">
			{exercise.sliders?.map((slider) => (
				<Slider 
					key={slider._key}
					item={slider} 
					answer={answers[slider.slug.current]}
					exerciseId={exercise._id}
					group={groups.length > 0} />
			))}
		</div>
	)
}
