import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { QuadrantSteps } from "./QuadrantSteps"
import type { QuadrantsParticipant } from "./types"

export interface QuadrantsExerciseProps {
	exercise: ST["exercise"]
	kickoffCode: string
}

export const QuadrantsExercise = async ({
	exercise,
	kickoffCode,
}: QuadrantsExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	const meta = participant.answers?.[exercise._id]?.meta
	const answers = participant.answers?.[exercise._id]?.answers ?? {}

	return (
		<div className="mt-8 h-full">
			{exercise.quadrants && (
				<QuadrantSteps
					answers={answers}
					quadrants={exercise.quadrants}
					exerciseId={exercise._id}
					meta={meta}
					todayInstructions={exercise.today_instructions}
					tomorrowInstructions={exercise.tomorrow_instructions}
					finalInstructions={exercise.finalize_instructions}
					kickoffCode={kickoffCode}
					readOnly={meta?.role === "contributor"}
					participantName={participant.name}
				/>
			)}
		</div>
	)
}
