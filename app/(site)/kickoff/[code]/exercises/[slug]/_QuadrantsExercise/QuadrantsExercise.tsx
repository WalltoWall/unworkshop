import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { QuadrantSteps } from "./QuadrantSteps"
import type { QuadrantsParticipant } from "./types"

export interface QuadrantsExerciseProps {
	exercise: ST["exercise"]
}

export const QuadrantsExercise = async ({
	exercise,
}: QuadrantsExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()
	const answers =
		participant.answers?.[exercise._id]?.answers ??
		exercise.quadrants?.map(() => ({
			today: { top: 0, left: 0, placed: false },
			tomorrow: { top: 0, left: 0, placed: false },
			arrow: { top: 0, left: 0, width: 0, angle: 0 },
		}))
	const groups = exercise.groups ?? []

	return (
		<div className="mt-8 h-full">
			{exercise.quadrants && (
				<QuadrantSteps
					answers={answers}
					quadrants={exercise.quadrants}
					exerciseId={exercise._id}
					group={groups.length > 0}
					todayInstructions={exercise.today_instructions}
					tomorrowInstructions={exercise.tomorrow_instructions}
					finalInstructions={exercise.finalize_instructions}
				/>
			)}
		</div>
	)
}
