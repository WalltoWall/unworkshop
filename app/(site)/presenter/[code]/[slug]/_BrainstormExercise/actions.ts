"use server"

import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import {
	BrainstormParticipant,
	type Answer,
	type BrainstormExercise,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"

const columnsSchema = z.record(
	z.string(),
	z.object({
		color: z.string(),
		title: z.string(),
		cards: z.array(
			z.object({
				id: z.string(),
				response: z.string(),
			}),
		),
	}),
)

const submitBoardSchema = zfd.formData({
	columns: zfd.json(columnsSchema),
	exerciseSlug: zfd.text(),
})

interface deleteParticipantProps {
	cardId: string
	exerciseSlug: string
}

export async function submitBoardAction(formData: FormData) {
	const data = submitBoardSchema.parse(formData)

	const exercise = await client.findExerciseBySlug(data.exerciseSlug)

	if (!exercise) return new Error("No Exercise Found")

	let presenterColumns: BrainstormExercise["answers"] = {}

	for (const key in data.columns) {
		Object.assign(presenterColumns, {
			[key]: {
				color: data.columns[key].color,
				title: data.columns[key].title,
				cards: data.columns[key].cards.map((card) => card.id),
			},
		})
	}

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

	console.log(participant)

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
