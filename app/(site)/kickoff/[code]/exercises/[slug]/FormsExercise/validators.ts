import { z } from "zod"

export const PositiveNumber = z.number().positive()

export const StringArray = z.array(z.string().optional().default(""))
export const AnswersArray = StringArray.transform((val) => val.filter(Boolean))
