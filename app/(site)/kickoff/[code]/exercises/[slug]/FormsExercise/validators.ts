import { z } from "zod"

export const PositiveNumber = z.number().positive()

export const AnswersArray = z
	.array(z.string().optional().default(""))
	.transform((val) => val.filter(Boolean))
