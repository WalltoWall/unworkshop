"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import { type FormParticipant } from "./types"

const ListFieldAnswerSchema = zfd.formData({
	answer: zfd
		.repeatableOfType(zfd.text(z.string().optional()))
		.transform((answers) => answers.filter(Boolean) as string[]),
	exerciseId: zfd.text(),
	stepIdx: zfd.numeric(),
})

export async function submitListFieldAnswer(formData: FormData) {
	const participant = await client.findParticipantOrThrow<FormParticipant>()
	const data = ListFieldAnswerSchema.parse(formData)

	const exerciseAnswers = participant.answers?.[data.exerciseId]

	const answers: FormParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...exerciseAnswers,
			steps:
				exerciseAnswers?.steps.toSpliced(data.stepIdx, 0, {
					data: {
						type: "List",
						responses: data.answer,
					},
				}) ?? [],
		},
	}

	const result = await sanity
		.patch(participant._id)
		.set({ answers })
		.commit()
		.catch(() => null)

	if (!result) {
		return { status: "failed" }
	}

	revalidatePath("/(site)/kickoff/[code]/exercises/[slug]", "page")

	return { status: "success" }
}
