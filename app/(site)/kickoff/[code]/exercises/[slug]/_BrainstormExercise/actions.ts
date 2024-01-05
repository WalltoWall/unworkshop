"use server"

import { revalidatePath } from "next/cache"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import { type BrainstormParticipant } from "./types"

const addCardSchema = zfd.formData({
	cardId: zfd.text(),
	exerciseId: zfd.text(),
	isGroup: zfd.checkbox(),
	step: zfd.text(),
})

const removeCardSchema = zfd.formData({
	exerciseId: zfd.text(),
	cardId: zfd.text(),
})

const submitCardSchema = zfd.formData({
	exerciseId: zfd.text(),
	cardId: zfd.text(),
	response: zfd.text(),
})

// TODO: Error Handling

export async function addCardAction(formData: FormData) {
	const data = addCardSchema.parse(formData)
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? []
	const meta = data.isGroup
		? {
				type: "group" as const,
				leader: participant._id,
		  }
		: { type: "individual" as const }

	const step = parseInt(data.step)

	const answers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta,
			answers: [...oldAnswers, { id: data.cardId, response: "", step: step }],
		},
	}

	await sanity.patch(participant._id).set({ answers }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}

export async function submitResponseAction(formData: FormData) {
	const data = submitCardSchema.parse(formData)

	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	if (!participant.answers) return

	const answers = participant.answers[data.exerciseId]?.answers ?? []

	if (answers.length < 0) return

	answers?.forEach((card) => {
		if (card.id === data.cardId) {
			card.response = data.response
		}
	})

	const newAnswers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers[data.exerciseId],
			answers,
		},
	}

	await sanity.patch(participant._id).set({ answers: newAnswers }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}

export async function removeCardAction(formData: FormData) {
	const data = removeCardSchema.parse(formData)

	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	if (!participant.answers) return

	const answers = participant.answers[data.exerciseId]?.answers ?? []

	if (answers.length < 0) return

	const newAnswers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers[data.exerciseId],
			answers: answers.filter((answer) => answer.id !== data.cardId),
		},
	}

	await sanity.patch(participant._id).set({ answers: newAnswers }).commit()

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
