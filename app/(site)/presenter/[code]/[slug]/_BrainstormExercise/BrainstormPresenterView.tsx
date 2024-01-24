import React from "react"
import { client } from "@/sanity/client"
import {
	type BrainstormExercise,
	type BrainstormParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { BrainstormPresenterViewClient } from "./BrainstormPresenterViewClient"

interface BrainstormPresenterViewProps {
	exercise: BrainstormExercise
}

export const BrainstormPresenterView = async ({
	exercise,
}: BrainstormPresenterViewProps) => {
	const participants =
		await client.findAllParticipantsInExercise<BrainstormParticipant>(
			exercise._id,
		)

	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient
				exercise={exercise}
				participants={participants}
			/>
		</div>
	)
}
