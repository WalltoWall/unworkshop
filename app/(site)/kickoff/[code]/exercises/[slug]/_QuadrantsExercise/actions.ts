"use server"

import { revalidatePath } from "next/cache"
import { zfd } from "zod-form-data"
import { client, sanity } from "@/sanity/client"
import { type QuadrantsParticipant } from "./types"

// const addQuadrantSchema = zfd.formData({
// 	exerciseId: zfd.text(),
// 	isGroup: zfd.checkbox(),
// 	quadrantName: zfd.text(),
// })

const submitQuadrantSchema = zfd.formData({
	exerciseId: zfd.text(),
	isGroup: zfd.checkbox(),
	quadrantName: zfd.text(),
	todayTop: zfd.numeric(),
	todayLeft: zfd.numeric(),
	tomorrowTop: zfd.numeric(),
	tomorrowLeft: zfd.numeric(),
})

export async function AddQuadrantAction(formData: FormData) {
	const data = addQuadrantSchema.parse(formData)
	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? []
	const meta = data.isGroup
		? {
				type: "group" as const,
				leader: participant._id,
		  }
		: { type: "individual" as const }

	const answers: QuadrantsParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta,
			answers: [
				...oldAnswers,
				{
					name: data.quadrantName,
					today: { top: 0, left: 0 },
					tomorrow: { top: 0, left: 0 },
				},
			],
		},
	}

	await sanity
		.patch(participant._id)
		.set({ answers })
		.commit()
		.catch(console.error)

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}

export async function submitQuadrantAction(formData: FormData) {
	const data = submitQuadrantSchema.parse(formData)

	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? []
	const meta = data.isGroup
		? {
				type: "group" as const,
				leader: participant._id,
		  }
		: { type: "individual" as const }

	const answers: QuadrantsParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta,
			answers: [],
		},
	}

	const existingAnswer = oldAnswers.findIndex(
		(a) => a.name === data.quadrantName,
	)

	if (existingAnswer > -1) {
		oldAnswers?.splice(existingAnswer, 1)
	}

	answers[data.exerciseId].answers = [
		...oldAnswers,
		{
			name: data.quadrantName,
			today: {
				top: data.todayTop,
				left: data.todayLeft,
			},
			tomorrow: {
				top: data.tomorrowTop,
				left: data.tomorrowLeft,
			},
		},
	]

	await sanity
		.patch(participant._id)
		.set({ answers })
		.commit()
		.catch(console.error)

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
