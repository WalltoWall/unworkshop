import { z } from "zod"

const BaseQuadrantsMessage = z.object({
	id: z.string(),
	stepIdx: z.number(),
})

export const UpdateDot = BaseQuadrantsMessage.extend({
	type: z.literal("update-dot"),
	dotType: z.union([z.literal("today"), z.literal("tomorrow")]),
	top: z.number(),
	left: z.number(),
})
