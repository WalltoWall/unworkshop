import React from "react"
import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type {
	SlidersExercise,
	SlidersParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

const SlidersPresenterViewClient = dynamic(
	() => import("./SlidersPresenterViewClient"),
	{
		ssr: false,
	},
)

interface SlidersPresenterViewProps {
	exercise: SlidersExercise
}

export const SlidersPresenterView = async ({
	exercise,
}: SlidersPresenterViewProps) => {
	const participant = await client.findParticipantOrThrow<SlidersParticipant>()

	return (
		<div className="px-8 pt-12">
			<SlidersPresenterViewClient
				exercise={exercise}
				participantId={participant._id}
			/>
		</div>
	)
}
