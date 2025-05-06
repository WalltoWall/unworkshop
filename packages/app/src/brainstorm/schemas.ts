import { z } from "zod"

export namespace BrainstormS {
	export const Sticky = z.object({
		id: z.string(),
		value: z.string(),
	})
	export type Sticky = z.infer<typeof Sticky>

	export const Answer = z.record(z.string(), z.array(Sticky))
	export type Answer = z.infer<typeof Answer>

	export const AllAnswers = z.record(z.string(), Answer)
	export type AllAnswers = z.infer<typeof AllAnswers>

	// Participant incoming events
	export const Message = z.discriminatedUnion([
		z.object({
			type: z.literal("update"),
			answer: Answer,
		}),
		z.object({
			type: z.literal("add"),
			payload: z.object({
				id: z.string(),
				step: z.int(),
			}),
		}),
		z.object({
			type: z.literal("edit"),
			payload: z.object({
				id: z.string(),
				step: z.int(),
				idx: z.number(),
				value: z.string(),
			}),
		}),
		z.object({
			type: z.literal("delete"),
			payload: z.object({
				id: z.string(),
				step: z.int(),
				idx: z.number(),
			}),
		}),
		z.object({
			type: z.literal("presenter"),
			answers: AllAnswers,
		}),
	])
	export type Message = z.infer<typeof Message>
}
