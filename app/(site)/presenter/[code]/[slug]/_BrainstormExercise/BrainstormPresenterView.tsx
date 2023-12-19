import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { BrainstormPresenterViewClient } from "./BrainstormPresenterViewClient"

interface BrainstormPresenterViewProps {
	exercise: ST["exercise"]
}

export const BrainstormPresenterView = async ({
	exercise,
}: BrainstormPresenterViewProps) => {
	const examples = [
		{ id: "a", response: "Slow Service" },
		{ id: "b", response: "Long wait times" },
		{ id: "c", response: "No wine service" },
		{ id: "d", response: "Not enough servers" },
		{ id: "e", response: "Not enough staff" },
	]

	const participants = await client.findAllParticipantsInExercise(exercise._id)

	const participantAnswers = participants.flatMap(
		(participant) => participant.answers[exercise._id].answers,
	)

	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient
				columnCards={examples}
				cards={participantAnswers}
			/>
		</div>
	)
}
