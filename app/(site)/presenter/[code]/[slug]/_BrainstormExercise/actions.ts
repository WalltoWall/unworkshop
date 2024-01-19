"use server"

import { revalidatePath } from "next/cache"
import { client, sanity } from "@/sanity/client"
import {
	type BrainstormExercise,
	type BrainstormParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import type { Columns } from "./BrainstormPresenterViewClient"

interface SubmitBoardProps {
	columns: Columns
	exerciseSlug: string
}

interface DeleteParticipantProps {
	cardId: string
	exerciseSlug: string
}

interface EditParticipantAnswerProps {
	cardId: string
	exerciseSlug: string
	newResponse: string
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

export async function deleteParticipantAnswer(data: DeleteParticipantProps) {
	const { cardId, exerciseSlug } = data

	const exercise = await client.findExerciseBySlug(exerciseSlug)

	if (!exercise) return new Error("No Exercise Found")

	const participants =
		await client.findAllParticipantsInExercise<BrainstormParticipant>(
			exercise?._id,
		)

	const exerciseId = exercise._id

	if (!exerciseId) return

	let participant: BrainstormParticipant

	participants.forEach((newParticipant) => {
		if (
			!newParticipant.answers ||
			!newParticipant.answers?.[exercise._id].answers
		)
			return

		if (
			newParticipant.answers[exerciseId].answers?.some(
				(card) => card.id === cardId,
			)
		) {
			participant = newParticipant
		}
	})

	if (!participant) throw new Error("No Participant found")

	const newCards = participant.answers![exerciseId].answers!.filter(
		(c) => c.id !== cardId,
	)

	const newAnswers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[exerciseId]: {
			...participant.answers![exerciseId],
			answers: newCards,
		},
	}

	await sanity.patch(participant._id).set({ answers: newAnswers }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}

export async function editParticipantAnswer(data: EditParticipantAnswerProps) {
	const { cardId, exerciseSlug, newResponse } = data

	const exercise = await client.findExerciseBySlug(exerciseSlug)

	if (!exercise) return new Error("No Exercise Found")

	const participants =
		await client.findAllParticipantsInExercise<BrainstormParticipant>(
			exercise?._id,
		)

	const exerciseId = exercise._id

	if (!exerciseId) return

	let participant: BrainstormParticipant

	participants.forEach((newParticipant) => {
		if (
			!newParticipant.answers ||
			!newParticipant.answers?.[exercise._id].answers
		)
			return

		if (
			newParticipant.answers[exerciseId].answers?.some(
				(card) => card.id === cardId,
			)
		) {
			participant = newParticipant
		}
	})

	if (!participant) throw new Error("No Participant found")

	const newCards = structuredClone(participant.answers![exerciseId].answers!)

	newCards.forEach((card) => {
		if (card.id === cardId) {
			card.response = newResponse
			return
		}
	})

	const newAnswers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[exerciseId]: {
			...participant.answers![exerciseId],
			answers: newCards,
		},
	}

	await sanity.patch(participant._id).set({ answers: newAnswers }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
