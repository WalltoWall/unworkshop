"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { client } from "@/sanity/client"
import { sanity } from "@/sanity/sanity-client"
import { type AddCardData, type BrainstormParticipant } from "./types"

const addCardSchema = z.object({
	id: z.string(),
	exerciseId: z.string(),
	isGroup: z.boolean(),
	step: z.number(),
})

const removeCardSchema = zfd.formData({
	exerciseId: zfd.text(),
	cardId: zfd.text(),
})

const submitCardSchema = zfd.formData({
	exerciseId: zfd.text(),
	cardId: zfd.text(),
	response: zfd.text(z.string().default("")),
})

// TODO: Error Handling

export async function addCardAction(data: AddCardData) {
	const { id, exerciseId, isGroup, step } = addCardSchema.parse(data)

	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	const oldAnswers = participant.answers?.[exerciseId]?.answers ?? []
	const meta = isGroup
		? {
				type: "group" as const,
				leader: participant._id,
			}
		: { type: "individual" as const }

	const answers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[exerciseId]: {
			...participant.answers?.[exerciseId],
			meta,
			answers: [...oldAnswers, { id: id, response: "", step: step }],
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
