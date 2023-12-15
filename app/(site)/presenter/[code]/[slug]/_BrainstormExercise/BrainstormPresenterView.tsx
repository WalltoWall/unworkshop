import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import type { BrainstormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { BrainstormPresenterViewClient } from "./BrainstormPresenterViewClient"
import { CardColumn } from "./CardColumn"

interface BrainstormPresenterViewProps {
	exercise: ST["exercise"]
}

export const BrainstormPresenterView = async ({
	exercise,
}: BrainstormPresenterViewProps) => {
	const examples = [
		"Slow Service",
		"Long wait times",
		"No wine service",
		"Not enough servers",
		"Not enough staff",
		"Staff not friendly",
	]

	const participants = await client.findAllParticipantsInExercise(exercise._id)

	const participantAnswers = participants.map(
		(participant) => participant.answers,
	)

	participantAnswers.forEach((idx) => {
		console.log(participantAnswers.at(idx).answers)
	})

	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient
				columnCards={examples}
				cards={["slow service", "slow service", "slow service", "slow service"]}
			/>
		</div>
	)
}
