import { useParams } from "next/navigation"
import { z } from "zod"

const ParamsSchema = z.object({
	code: z.string(),
	slug: z.string(),
	group: z.string().optional(),
})

export function useExerciseParams() {
	const params = useParams()

	return ParamsSchema.parse(params)
}

const RequiredGroupParamsSchema = ParamsSchema.extend({
	group: z.string(),
})

export function useExerciseGroupParams() {
	const params = useParams()

	return RequiredGroupParamsSchema.parse(params)
}
