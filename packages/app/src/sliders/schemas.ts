import { z } from "zod"

export namespace SlidersS {
	export const AnswerValue = z.number().min(1)
	export type AnswerValue = z.infer<typeof AnswerValue>

	export const AnswerType = z.literal(["today", "tomorrow"])
	export type AnswerType = z.infer<typeof AnswerType>

	export const Answer = z.record(
		z.string(),
		z.object({
			today: AnswerValue.default(1),
			tomorrow: AnswerValue.optional(),
		}),
	)
	export type Answer = z.infer<typeof Answer>

	export const AllAnswers = z.record(z.string(), Answer)
	export type AllAnswers = z.infer<typeof AllAnswers>

	export const Message = z.discriminatedUnion([
		z.object({ type: z.literal("update"), answer: Answer }),
		z.object({
			type: z.literal("change"),
			payload: z.object({
				id: z.string(),
				prompt: z.string(),
				type: AnswerType,
				value: AnswerValue,
			}),
		}),
		z.object({
			type: z.literal("presenter"),
			answers: AllAnswers,
		}),
	])
	export type Message = z.infer<typeof Message>
}
