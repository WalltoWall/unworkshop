import { env } from "@/env"
import { createClient } from "next-sanity"

export const sanity = createClient({
	projectId: env.projectId,
	dataset: env.dataset,
	apiVersion: env.apiVersion,
	useCdn: false,
})
