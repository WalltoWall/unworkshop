import { defineQuery } from "groq"
import { slugify } from "@/lib/slugify"
import { sanity } from "./client"

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

				_type == 'sliders' => { "steps": count(steps) },
				_type == 'brainstorm' => { "steps": count(steps) }
			}
		}`)

	export async function getKickoff(code: string) {
		return await sanity.fetch(kickoffQ, { code })
	}

	const exerciseQ = defineQuery(`
		*[_type == "kickoff" && code.current == $code][0].exercises[] {
			name,
			groups,
			"type": _type,

			_type == 'sliders' => { steps },
			_type == 'brainstorm' => { steps }
		}`)

	export async function getExercise(code: string, slug: string) {
		const result = await sanity.fetch(exerciseQ, { code })
		if (!result) return null

		const exercise = result.find((e) => slugify(e.name) === slug)
		if (!exercise) return null

		return exercise
	}
}
