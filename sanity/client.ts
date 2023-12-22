import { createClient, groq } from "next-sanity"
import { env } from "@/env"
import type { Exercise } from "./schemas/documents/Exercise"
import type { Kickoff } from "./schemas/documents/Kickoff"
import type { Participant } from "./schemas/documents/Participant"

export const sanity = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	token: env.SANITY_TOKEN,
	useCdn: false,
})

export const client = {
	findKickoff: async (code: string) => {
		type KickoffWithExercises = Omit<Kickoff, "exercises"> & {
			exercises: Exercise[]
		}

		const data = await sanity.fetch<KickoffWithExercises | null>(
			groq`*[_type == "kickoff" && code.current == $code][0] {
            ...,
            exercises[]->
        }`,
			{ code: code.toLowerCase() },
		)

		return data
	},

	findKickoffOrThrow: async (code: string) => {
		const kickoff = await client.findKickoff(code)
		if (!kickoff) throw new Error("Kickoff not found, when expected.")

		return kickoff
	},

	registerParticipant: async (args: { name: string; kickoffId: string }) => {
		const data: Pick<Participant, "name" | "kickoff" | "_type"> = {
			_type: "participant",
			name: args.name,
			kickoff: {
				_type: "reference",
				_weak: true,
				_ref: args.kickoffId,
			},
		}

		const res = await sanity.create(data)

		return res
	},

	onboardParticipant: async (id: string) => {
		const data: Pick<Participant, "onboarded"> = {
			onboarded: true,
		}

		const res: Participant = await sanity.patch(id).set(data).commit()

		return res
	},

	findParticipant: async (id: string) => {
		const data = await sanity.fetch<Participant | null>(
			groq`*[_type == "participant" && _id == $id][0]`,
			{ id },
		)

		return data
	},

	findExerciseBySlug: async (slug: string) => {
		const data = await sanity.fetch<Exercise | null>(
			groq`*[_type == "exercise" && slug.current == $slug][0]`,
			{ slug },
		)

		return data
	},
}
