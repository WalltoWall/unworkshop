import { createClient } from "next-sanity"
import { Resource } from "sst"
import { env } from "@/env"

export const sanity = createClient({
	projectId: Resource.SanityProjectId.value,
	dataset: Resource.SanityDataset.value,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	token: Resource.SanityToken.value,
	perspective: "published",
	useCdn: false,
})
