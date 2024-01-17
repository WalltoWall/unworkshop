import React from "react"
import * as R from "remeda"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import {
	type Answer,
	type BrainstormExercise,
	type BrainstormParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import {
	BrainstormPresenterViewClient,
	type Column,
} from "./BrainstormPresenterViewClient"
import { SORTING_COLUMN_ID } from "./constants"

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
	const perceptions =
		await client.findExerciseBySlug<BrainstormExercise>("perceptions")

	const participantAnswers = participants
		.flatMap((participant) => participant.answers?.[exercise._id].answers)
		.filter(Boolean) as Array<Answer>

	const answerMap = new Map<string, string>()

	participantAnswers.forEach((answer) =>
		answerMap.set(answer.id, answer.response),
	)

	if (!perceptions) return

	const answersWithResponses = perceptions.answers?.map((column) => {
		const newCol: Column = {
			...column,
			cards: column.cards.map((cardId) => {
				if (!answerMap.has(cardId))
					throw new Error(`No Id found for card: ${cardId}`)

				const response = answerMap.get(cardId)!

				const answer: Answer = {
					id: cardId,
					response: response,
				}

				return answer
			}),
		}

		return newCol
	}) ?? [
		{
			columnId: SORTING_COLUMN_ID,
			title: "",
			color: "",
			cards: participantAnswers,
		},
	]

	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient
				exerciseSlug={exercise.slug}
				presenterColumns={answersWithResponses}
			/>
		</div>
	)
}
