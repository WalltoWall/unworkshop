"use server"

import { revalidatePath } from "next/cache"
import { client } from "@/sanity/client"
import { sanity } from "@/sanity/sanity-client"
import { type FormFieldAnswer, type FormParticipant } from "./types"

type Data = {
	answer: FormFieldAnswer
	fieldIdx: number
	exerciseId: string
	stepIdx: number
}

export async function submitFieldAnswer(data: Data) {
	const participant = await client.findParticipantOrThrow<FormParticipant>()

	participant.answers ??= {}
	participant.answers[data.exerciseId] ??= { steps: [] }
	participant.answers[data.exerciseId].steps[data.stepIdx] ??= { data: [] }
	participant.answers[data.exerciseId].steps[data.stepIdx].data[data.fieldIdx] =
		data.answer

	const result = await sanity
		.patch(participant._id)
		.set({ answers: participant.answers })
		.commit()
		.catch(() => null)

	if (!result) {
		return { status: "failed" }
	}

	revalidatePath("/(site)/kickoff/[code]/exercises/[slug]", "page")

	return { status: "success" }
}
