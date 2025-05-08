import { z } from "zod"

export namespace BrainstormS {
	export const PresenterSorter = z.object({ name: z.string() })
	export type PresenterSorter = z.infer<typeof PresenterSorter>

	export const PresenterNoteMetadata = z.object({ column: z.number() })
	export type PresenterNoteMetadata = z.infer<typeof PresenterNoteMetadata>

	export const PresenterState = z.object({
		unsortedColumns: z.number(),
		stickies: z.record(z.string(), PresenterNoteMetadata),
		sorters: z.record(z.string(), PresenterSorter),
	})
	export type PresenterState = z.infer<typeof PresenterState>

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
			type: z.literal("presenter-all"),
			answers: AllAnswers,
			state: PresenterState,
		}),
		z.object({
			type: z.literal("update-presenter-state"),
			state: PresenterState,
		}),
		z.object({
			type: z.literal("update-presenter-answers"),
			answers: AllAnswers,
		}),
		z.object({ type: z.literal("add-unsorted-column") }),
		z.object({ type: z.literal("delete-unsorted-column") }),
	])
	export type Message = z.infer<typeof Message>
}
