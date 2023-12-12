import React from "react"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import type { BrainstormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
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
			<div className="flex w-full gap-2 rounded-2xl bg-gray-90 px-4 py-5">
				<div className="min-h-[135px] min-w-[135px] rounded-lg bg-white px-3 py-2">
					slow service
				</div>
				<div className="min-h-[135px] min-w-[135px] rounded-lg bg-white px-1 py-2">
					slow service
				</div>
				<div className="min-h-[135px] min-w-[135px] rounded-lg bg-white px-1 py-2">
					slow service
				</div>
				<div className="min-h-[135px] min-w-[135px] rounded-lg bg-white px-1 py-2">
					slow service
				</div>
				<div className="min-h-[135px] min-w-[135px] rounded-lg bg-white px-1 py-2">
					slow service
				</div>
			</div>

			<div className="flex gap-4">
				<CardColumn cards={examples} />
				<CardColumn cards={examples} />
				<CardColumn cards={examples} />
			</div>
		</div>
	)
}
