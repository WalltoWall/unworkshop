import React from "react"
import { groq } from "next-sanity"
import { cookies } from "next/headers"
import type { Reference } from "sanity"
import { z } from "zod"
import { PARTICIPANT_COOKIE } from "@/constants"
import type * as ST from "@/sanity/types.gen"
import { q } from "./groqd"
import { sanity } from "./sanity-client"

export const client = {
	findKickoff: React.cache(async (code: string) => {
		const query = q.star
			.parameters<{ code: string }>()
			.filterByType("kickoff")
			.filterBy("code.current == $code")
			.project((sub) => ({
				title: q.string(),
				code: q.slug("code"),
				exercises: sub
					.field("exercises[]")
					.deref()
					.project((sub) => ({
						name: q.string(),
						slug: q.slug("slug"),
						illustration: q.default(q.string(), "speechBubbles"),
						groups: sub.field("groups"),
					})),
			}))
			.slice(0)

		const kickoffQuery = groq`*[_type == "kickoff" && code.current == $code][0] {
			...,
			exercises[]->
		}`

		const data = await sanity.fetch<ST.KickoffQueryResult>(
			kickoffQuery,
			{ code: code.toLowerCase() },
			{ cache: "no-store" },
		)

		return data
	}),

	findParticipant: React.cache(
		async <T extends ST.Participant = ST.Participant>(id: string) => {
			const participantQuery = groq`*[_type == "participant" && _id == $id][0]`

			const data = await sanity.fetch<T | null>(
				participantQuery,
				{ id },
				{ cache: "no-store" },
			)

			return data
		},
	),

	findParticipantViaCookie: React.cache(async () => {
		const cookiesStore = await cookies()
		const id = cookiesStore.get(PARTICIPANT_COOKIE)?.value
		if (!id) return null

		const participantWithKickoffCodeQuery = groq`*[_type == "participant" && _id == $id][0] {
			...,
			kickoff->{ "code": code.current }
		}`

		const data = await sanity.fetch<ST.ParticipantWithKickoffCodeQueryResult>(
			participantWithKickoffCodeQuery,
			{ id },
			{ cache: "no-store" },
		)

		return data
	}),

	findParticipantOrThrow: React.cache(async <
		T extends ST.Participant = ST.Participant,
	>() => {
		const cookiesStore = await cookies()
		const participantId = z
			.string()
			.parse(cookiesStore.get(PARTICIPANT_COOKIE)?.value)

		const participant = await client.findParticipant<T>(participantId)
		if (!participant) throw new Error("No participant found.")

		return participant
	}),

	// prettier-ignore
	async findAllParticipantsInExercise<T extends ST.Participant = ST.Participant>(exerciseId: string) {
        const participants = await sanity.fetch<Array<T>>(
            groq`*[_type == "participant" && answers[$exerciseId] != null]{
                ...,
                answers
            }`,
            {exerciseId},
            { cache: "no-store" }
        )

        return participants
    },

	async findAllParticipantsInKickoff(kickoffId: string) {
		const participantsInKickoffQuery = groq`*[_type == "participant" && kickoff._ref == $kickoffId]`

		const participants =
			await sanity.fetch<ST.ParticipantsInKickoffQueryResult>(
				participantsInKickoffQuery,
				{ kickoffId },
				{ cache: "no-store" },
			)

		return participants
	},

	async findKickoffOrThrow(code: string) {
		const kickoff = await client.findKickoff(code)
		if (!kickoff) throw new Error("Kickoff not found, when expected.")

		return kickoff
	},

	async registerParticipant(args: {
		name: string
		kickoffId: string
		recoveryCode: string
	}) {
		type Data = Pick<ST.Participant, "name" | "recovery_code" | "_type"> & {
			kickoff: Reference
		}

		const existing = await sanity.fetch<ST.Participant | null>(
			groq`*[_type == "participant" && recovery_code == $name && kickoff._ref == $kickoffId][0]`,
			{ name: args.name, kickoffId: args.kickoffId },
			{ cache: "no-store" },
		)

		if (existing) return existing

		const data: Data = {
			_type: "participant",
			name: args.name,
			recovery_code: args.recoveryCode,
			kickoff: {
				_type: "reference",
				_weak: true,
				_ref: args.kickoffId,
			},
		}

		const res = await sanity.create(data)

		return res
	},

	async findExerciseBySlug<T extends ST.Exercise = ST.Exercise>(slug: string) {
		const data = await sanity.fetch<T | null>(
			groq`*[_type == "exercise" && slug.current == $slug][0]{ ..., }`,
			{ slug },
			{ cache: "no-store" },
		)

		return data
	},
}
