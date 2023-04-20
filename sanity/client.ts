import * as React from "react"
import { env } from "@/env"
import { createClient, groq } from "next-sanity"
import type { Settings } from "./schemas/documents/Settings"

export const sanity = createClient({
	projectId: env.projectId,
	dataset: env.dataset,
	apiVersion: env.apiVersion,
	useCdn: false,
})

// By using React's built-in caching, we can de-dupe and cache requests
// when on the server. This allows us to make multiple calls in different parts
// of our app and ultimately only make one request on the server.
//
// If ran in the browser, these calls just behave as expected.
export const client = {
	settings: React.cache(() =>
		sanity.fetch<Settings>(groq`*[_type == "settings"][0]`),
	),
}
