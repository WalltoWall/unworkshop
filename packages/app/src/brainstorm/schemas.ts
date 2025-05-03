import { z } from "zod"

export namespace BrainstormS {
	export const Answer = z.record(z.string(), z.array(z.string()))
	export type Answer = z.infer<typeof Answer>

	export const AllAnswers = z.record(z.string(), Answer)
	export type AllAnswers = z.infer<typeof AllAnswers>

	// Participant incoming events
	export const Message = z.discriminatedUnion([
		z.interface({
			type: z.literal("init"),
			answer: Answer,
		}),
		z.interface({
			type: z.literal("update"),
			msgId: z.string(),
			answer: Answer,
		}),
		z.interface({
			type: z.literal("submission"),
			msgId: z.string(),
			payload: z.object({
				id: z.string(),
				step: z.int(),
				value: z.string(),
			}),
		}),
		z.interface({
			type: z.literal("edit"),
			msgId: z.string(),
			payload: z.object({
				id: z.string(),
				step: z.int(),
				idx: z.number(),
				value: z.string(),
			}),
		}),
		z.interface({
			type: z.literal("presenter"),
			answers: AllAnswers,
		}),
	])
	export type Message = z.infer<typeof Message>
}
