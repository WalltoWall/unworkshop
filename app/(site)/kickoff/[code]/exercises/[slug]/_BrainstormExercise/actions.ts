"use server"

import { revalidatePath } from "next/cache"
import { uid } from "uid"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import { type BrainstormParticipant } from "./types"

const addCardSchema = zfd.formData({
	exerciseId: zfd.text(),
	isGroup: zfd.checkbox(),
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
	const id = uid()
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? []
	const meta = data.isGroup
		? {
				type: "group" as const,
				leader: participant._id,
		  }
		: { type: "individual" as const }

	const answers: BrainstormParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta,
			answers: [...oldAnswers, { id, response: "" }],
		},
	}

	await sanity
		.patch(participant._id)
		.set({ answers })
		.commit()
		.catch(console.error)

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}

export async function submitResponseAction(formData: FormData) {
	const data = submitCardSchema.parse(formData)
	console.log(data)
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	const answers = participant.answers?.[data.exerciseId]?.answers

	// iterate over whole array, see if it matches the id of card looking to change response of
	// and change that response and then put back new array and overwrite answers array
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

	await sanity
		.patch(participant._id)
		.set({ answers: newAnswers })
		.commit()
		.catch(console.error)

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
