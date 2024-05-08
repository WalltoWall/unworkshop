import { z } from "zod"

const BaseQuadrantsMessage = z.object({
	id: z.string(),
	stepIdx: z.number(),
})
