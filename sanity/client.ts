import * as React from "react"
import { groq } from "next-sanity"
import { Kickoff } from "./schemas/documents/Kickoff"
import { sanity } from "./sanity-client"

// By using React's built-in caching, we can de-dupe and cache requests
// when on the server. This allows us to make multiple calls in different parts
// of our app and ultimately only make one request on the server.
export const client = {
	findKickoff: React.cache(async (code: string) => {
		const data = await sanity.fetch<Kickoff>(
			groq`*[_type == "kickoff" && code.current == $code][0]`,
			{ code: code.toLowerCase() },
		)

		return data
	}),
}
