import { z } from "zod"

export namespace SlidersS {
	export const AnswerValue = z.number().min(1)
	export type AnswerValue = z.infer<typeof AnswerValue>

	export const AnswerType = z.literal(["today", "tomorrow"])
	export type AnswerType = z.infer<typeof AnswerType>

	export const Answer = z.record(
		z.string(),
		z.object({
			today: AnswerValue.default(4),
			tomorrow: AnswerValue.optional(),
		}),
	)
	export type Answer = z.infer<typeof Answer>

	export const AllAnswers = z.record(z.string(), Answer)
	export type AllAnswers = z.infer<typeof AllAnswers>
}
