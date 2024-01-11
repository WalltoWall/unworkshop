import { z } from "zod"
import { zfd } from "zod-form-data"

export const Columns = zfd.json(
	z.record(
		z.string(),
		z.object({
			color: z.string(),
			title: z.string(),
			cards: z.array(
				z.object({
					id: z.string(),
					response: z.string(),
				}),
			),
		}),
	),
)

export const ExerciseSlug = zfd.text()

export const ColumnTitle = zfd.text()

export const ColumnId = zfd.text()

export const Color = zfd.text()
