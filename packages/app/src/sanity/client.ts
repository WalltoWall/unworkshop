import React from "react"
import { defineQuery } from "next-sanity"
import { slugify } from "@/lib/slugify"
import { sanity } from "./sanity-client"

export namespace Api {
	const kickoffQ = defineQuery(`
		*[_type == "kickoff" && code.current == $code][0] {
			title,
			"code": code.current,
			greeting,
			exercises[] { 
				name, 
				illustration, 
				groups, 
				"type": _type, 

				_type == 'sliders' => { "steps": count(steps) }
			}
		}`)

	export const getKickoff = React.cache((code: string) => {
		return sanity.fetch(kickoffQ, { code })
	})

	const exerciseQ = defineQuery(`
		*[_type == "kickoff" && code.current == $code][0].exercises[] {
			name,
			groups,
			"type": _type,

			_type == 'sliders' => { steps }
		}`)

	export const getExercise = React.cache(async (code: string, slug: string) => {
		const result = await sanity.fetch(exerciseQ, { code })
		if (!result) return null

		const exercise = result.find((e) => slugify(e.name) === slug)
		if (!exercise) return null

		return exercise
	})
}
