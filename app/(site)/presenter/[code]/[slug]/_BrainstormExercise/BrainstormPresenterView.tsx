import React from "react"
import { client } from "@/sanity/client"
import { type BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { BrainstormPresenterViewClient } from "./BrainstormPresenterViewClient"

interface BrainstormPresenterViewProps {
	exercise: BrainstormExercise
}

export const BrainstormPresenterView = async ({
	exercise,
}: BrainstormPresenterViewProps) => {
	const initialData = await client.getBrainstormExerciseData(exercise._id)

	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient
				initialData={initialData}
				exerciseId={exercise._id}
			/>
		</div>
	)
}
