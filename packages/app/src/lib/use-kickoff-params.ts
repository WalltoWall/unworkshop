import { useParams } from "next/navigation"
import { z } from "zod"

const ParamsSchema = z.object({ code: z.string() })

export function useKickoffParams() {
	const params = useParams()

	return ParamsSchema.parse(params)
}
