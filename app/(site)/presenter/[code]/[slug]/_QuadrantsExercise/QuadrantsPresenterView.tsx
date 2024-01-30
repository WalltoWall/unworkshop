import React from "react"
import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"

const QuadrantsPresenterViewClient = dynamic(
	() => import("./QuadrantsPresenterViewClient"),
	{
		ssr: false,
	},
)

interface QuadrantsPresenterViewProps {
	exercise: ST["exercise"]
}

export const QuadrantsPresenterView = async ({
	exercise,
}: QuadrantsPresenterViewProps) => {
	const participants = await client.findAllParticipantsInExercise(exercise._id)

	// const participantAnswers = participants.flatMap(
	// 	(participant) => participant.answers[exercise._id].answers,
	// )

	// const groupedAnswers = participantAnswers.reduce((group, answer) => {
	// 	const slugs = Object.keys(answer)
	// 	slugs.forEach((slug) => {
	// 		group[slug] = group[slug] ?? []
	// 		group[slug].push(answer[slug])
	// 	})

	// 	return group
	// }, {})

	return (
		<div className="h-[calc(100vh-5.5rem)] px-8 py-12">
			<QuadrantsPresenterViewClient
				exercise={exercise}
				participants={participants}
			/>
		</div>
	)
}
