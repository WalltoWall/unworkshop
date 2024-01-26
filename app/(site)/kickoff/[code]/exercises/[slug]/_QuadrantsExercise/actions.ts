"use server"

import { revalidatePath } from "next/cache"
import zod from "zod"
import { client } from "@/sanity/client"
import { sanity } from "@/sanity/sanity-client"
import { type Answer, type QuadrantsParticipant } from "./types"

const submitQuadrantSchema = zod.object({
	answer: zod.object({
		slug: zod.string(),
		newAnswer: zod.object({
			today: zod
				.object({
					top: zod.number(),
					left: zod.number(),
				})
				.optional(),
			tomorrow: zod
				.object({
					top: zod.number(),
					left: zod.number(),
				})
				.optional(),
		}),
	}),
	exerciseId: zod.string(),
	isGroup: zod.boolean(),
})

export async function submitQuadrantAction(newAnswer: {
	answer: { slug: string; newAnswer: Answer }
	exerciseId: string
	isGroup: boolean
}) {
	const data = submitQuadrantSchema.parse(newAnswer)

	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? {}
	const meta = data.isGroup
		? {
				type: "group" as const,
				leader: participant._id,
			}
		: { type: "individual" as const }

	const newPositions = { ...oldAnswers[data.answer.slug] }

	if (data.answer.newAnswer?.today) {
		newPositions.today = data.answer.newAnswer?.today
	}

	if (data.answer.newAnswer?.tomorrow) {
		newPositions.tomorrow = data.answer.newAnswer?.tomorrow
	}

	const answers: QuadrantsParticipant["answers"] = {
		...participant.answers,
		[data.exerciseId]: {
			...participant.answers?.[data.exerciseId],
			meta,
			answers: {
				...oldAnswers,
				[data.answer.slug]: newPositions,
			},
		},
	}

	await sanity
		.patch(participant._id)
		.set({ answers })
		.commit()
		.catch(console.error)

	revalidatePath("/kickoff/[code]/exercises/[slug]", "page")
}
