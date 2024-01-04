import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { QuadrantsPresenterViewClient } from "./QuadrantsPresenterViewClient"

interface QuadrantsPresenterViewProps {
	exercise: ST["exercise"]
}

export const QuadrantsPresenterView = async ({
	exercise,
}: QuadrantsPresenterViewProps) => {
	const participants = await client.findAllParticipantsInExercise(exercise._id)

	const participantAnswers = participants.flatMap(
		(participant) => participant.answers[exercise._id].answers,
	)

	const groupedAnswers = participantAnswers.reduce((group, answer) => {
		const names = Object.keys(answer)
		names.forEach((name) => {
			group[name] = group[name] ?? []
			group[name].push(answer[name])
		})

		return group
	}, {})

	return (
		<div className="h-[calc(100vh-5.5rem)] px-8 py-12">
			<QuadrantsPresenterViewClient
				exercise={exercise}
				answers={groupedAnswers}
			/>
		</div>
	)
}
