import { env } from "@/env"
import { createClient } from "next-sanity"

export const sanity = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	token: env.SANITY_TOKEN,
	useCdn: false,
})
