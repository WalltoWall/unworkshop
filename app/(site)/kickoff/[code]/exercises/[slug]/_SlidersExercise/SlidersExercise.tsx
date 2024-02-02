import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { InstructionsModal } from "../InstructionsModal"
import type { SlidersParticipant } from "./types"

export type SliderItem = NonNullable<ST["exercise"]["sliders"]>[number]

const SlidersClient = dynamic(() => import("./SlidersClient"), {
	ssr: false,
})

type Props = {
	exercise: ST["exercise"]
}

export const SlidersExercise = async ({ exercise }: Props) => {
	const participant = await client.findParticipantOrThrow<SlidersParticipant>()

	return (
		<>
			<InstructionsModal
				exerciseName={exercise.name}
				instructions={exercise.instructions}
			/>

			<div className="mt-8">
				<SlidersClient exercise={exercise} participant={participant} />
			</div>
		</>
	)
}
