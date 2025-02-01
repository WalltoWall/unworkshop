import { createClient } from "next-sanity"
import { env } from "@/env"

export const sanity = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	token: env.SANITY_TOKEN,
	perspective: "published",
	useCdn: false,
})
