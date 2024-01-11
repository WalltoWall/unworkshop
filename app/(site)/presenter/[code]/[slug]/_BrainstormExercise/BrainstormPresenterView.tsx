import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import type { BrainstormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { BrainstormPresenterViewClient } from "./BrainstormPresenterViewClient"

interface BrainstormPresenterViewProps {
	exercise: ST["exercise"]
}

export const BrainstormPresenterView = async ({
	exercise,
}: BrainstormPresenterViewProps) => {
	const participants =
		await client.findAllParticipantsInExercise<BrainstormParticipant>(
			exercise._id,
		)

	const participantAnswers = participants.flatMap(
		(participant) => participant.answers?.[exercise._id].answers ?? [],
	)

	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient cards={participantAnswers} />
		</div>
	)
}
