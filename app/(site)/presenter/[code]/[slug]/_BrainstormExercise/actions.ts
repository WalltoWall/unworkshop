"use server"

import { revalidatePath } from "next/cache"
import { client, sanity } from "@/sanity/client"
import {
	type Answer,
	type BrainstormExercise,
	type BrainstormParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import type { Columns } from "./BrainstormPresenterViewClient"

interface SubmitBoardProps {
	columns: Columns
	exerciseSlug: string
}

interface deleteParticipantProps {
	cardId: string
	exerciseSlug: string
}

export async function submitBoardAction(data: SubmitBoardProps) {
	const exercise = await client.findExerciseBySlug(data.exerciseSlug)

	if (!exercise) throw new Error("No Exercise Found")

	let presenterColumns: BrainstormExercise["answers"] = []

	data.columns.forEach((col) => {
		const newCards = col.cards.map((card) => card.id)

		presenterColumns?.push({
			...col,
			cards: newCards,
		})
	})

	await sanity.patch(exercise._id).set({ answers: presenterColumns }).commit()

	revalidatePath("/presenter/[code]/[slug]", "page")
}

export async function deleteParticipantAnswer(data: deleteParticipantProps) {
	const { cardId, exerciseSlug } = data

	const exercise = await client.findExerciseBySlug(exerciseSlug)

	if (!exercise) return new Error("No Exercise Found")

	const participants =
		await client.findAllParticipantsInExercise<BrainstormParticipant>(
			exercise?._id,
		)

	let participant: BrainstormParticipant

	participants.forEach((newParticipant) => {
		if (!participant.answers) return

		if (
			participant.answers?.[exercise._id].answers?.some(
				(card) => card.id === cardId,
			)
		) {
			participant = newParticipant
		}
	})

	// const answers = participant.answers[data.exerciseId]?.answers ?? []

	// if (answers.length < 0) return

	// answers?.forEach((card) => {
	// 	if (card.id === data.cardId) {
	// 		card.response = data.response
	// 	}
	// })

	// const newAnswers: BrainstormParticipant["answers"] = {
	// 	...participant.answers,
	// 	[data.exerciseId]: {
	// 		...participant.answers[data.exerciseId],
	// 		answers,
	// 	},
	// }

	// await sanity.patch(participant._id).set({ answers: newAnswers }).commit()

	// revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
