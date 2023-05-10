import * as React from "react"
import { groq } from "next-sanity"
import type { Kickoff } from "./schemas/documents/Kickoff"
import type { Participant } from "./schemas/documents/Participant"
import type { Exercise } from "./schemas/documents/Exercise"
import { sanity } from "./sanity-client"

// By using React's built-in caching, we can de-dupe and cache requests
// when on the server. This allows us to make multiple calls in different parts
// of our app and ultimately only make one request on the server.

export const findKickoff = React.cache(async (code: string) => {
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
})

export const findKickoffOrThrow = React.cache(async (code: string) => {
	const kickoff = await findKickoff(code)
	if (!kickoff) throw new Error("Kickoff not found, when expected.")

	return kickoff
})

export const registerParticipant = async (args: {
	name: string
	kickoffId: string
}) => {
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
}

export const onboardParticipant = async (id: string) => {
	const data: Pick<Participant, "onboarded"> = {
		onboarded: true,
	}

	const res: Participant = await sanity.patch(id).set(data).commit()

	return res
}

export const findParticipant = React.cache(async (id: string) => {
	const data = await sanity.fetch<Participant | null>(
		groq`*[_type == "participant" && _id == $id][0]`,
		{ id },
	)

	return data
})
