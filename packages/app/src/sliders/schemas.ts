import { z } from "zod"

export namespace SlidersS {
	export const Value = z.number().min(1)
	export type Value = z.infer<typeof Value>

	export const Type = z.literal(["today", "tomorrow"])
	export type Type = z.infer<typeof Type>

	export const Answer = z.record(
		z.string(),
		z.object({
			today: Value.default(4),
			tomorrow: Value.optional(),
		}),
	)
	export type Answer = z.infer<typeof Answer>

	export type Shape = { groupAnswers: Record<string, Answer> }
}
