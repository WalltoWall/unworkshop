import React from "react"
import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/types.gen"
import type { BrainstormParticipant } from "./types"

const BrainstormClient = dynamic(() => import("./BrainstormClient"), {
	ssr: false,
})

export interface BrainstormExerciseProps {
	exercise: ST["exercise"]
	kickoffCode: string
	groupSlug?: string
}

export const BrainstormExercise = async ({
	exercise,
	groupSlug,
}: BrainstormExerciseProps) => {
	const participant =
		await client.findParticipantOrThrow<BrainstormParticipant>()

	return (
		<div className="mt-4 flex flex-[1_1_0] flex-col">
			<BrainstormClient
				exercise={exercise}
				participant={participant}
				groupSlug={groupSlug}
			/>
		</div>
	)
}
