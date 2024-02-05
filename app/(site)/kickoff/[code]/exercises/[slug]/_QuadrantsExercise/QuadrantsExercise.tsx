import React from "react"
import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import type { QuadrantsParticipant } from "./types"

const QuadrantsClient = dynamic(() => import("./QuadrantsClient"), {
	ssr: false,
})

export interface QuadrantsExerciseProps {
	exercise: ST["exercise"]
	groupSlug?: string
	kickoffCode: string
}

export const QuadrantsExercise = async ({
	exercise,
	groupSlug,
	kickoffCode,
}: QuadrantsExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<QuadrantsParticipant>()

	return (
		<div className="mt-8 h-full">
			{exercise.quadrants && (
				<QuadrantsClient
					exercise={exercise}
					participant={participant}
					groupSlug={groupSlug}
					kickoffCode={kickoffCode}
				/>
			)}
		</div>
	)
}
