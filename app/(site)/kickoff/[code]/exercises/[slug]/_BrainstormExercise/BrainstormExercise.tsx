import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import BrainstormClient from "./BrainstormClient"
import type { BrainstormParticipant } from "./types"

export interface BrainstormExerciseProps {
	exercise: ST["exercise"]
	kickoffCode: string
}

export const BrainstormExercise = async ({
	exercise,
	kickoffCode,
}: BrainstormExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()
	const cards = participant.answers?.[exercise._id]?.answers ?? []
	const groups = exercise.groups ?? []

	const steps = exercise.steps

	return (
		<div className="mt-4 flex h-full flex-col">
			<BrainstormClient
				steps={steps}
				cards={cards}
				groups={groups}
				exerciseId={exercise._id}
				kickoffCode={kickoffCode}
			/>
		</div>
	)
}
