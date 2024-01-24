"use server"

import { revalidatePath } from "next/cache"
import zod from "zod"
import { client, sanity } from "@/sanity/client"
import type { GroupAnswer, IndividualAnswer } from "@/types"
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
})

export async function submitQuadrantAction(newAnswer: {
	answer: { slug: string; newAnswer: Answer }
	exerciseId: string
}) {
	const data = submitQuadrantSchema.parse(newAnswer)

	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	const oldAnswers = participant.answers?.[data.exerciseId]?.answers ?? {}
	const meta = participant.answers?.[data.exerciseId]?.meta ?? {
		type: "individual" as const,
	}

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
			meta: meta as IndividualAnswer | GroupAnswer,
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
