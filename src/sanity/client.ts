import React from "react"
import { defineQuery } from "next-sanity"
import { sanity } from "./sanity-client"

export namespace Api {
	const kickoffQ =
		defineQuery(`*[_type == "kickoff" && code.current == $code][0] {
			title,
			"code": code.current,
			greeting,
			exercises[]->{ name, "slug": slug.current, illustration, groups }
		}`)

	export const getKickoff = React.cache((code: string) => {
		return sanity.fetch(kickoffQ, { code })
	})
}
