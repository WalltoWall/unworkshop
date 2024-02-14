import React from "react"
import dynamic from "next/dynamic"
import { client } from "@/sanity/client"
import type { ST } from "@/sanity/types.gen"

const QuadrantsPresenterViewClient = dynamic(
	() => import("./QuadrantsPresenterViewClient"),
	{
		ssr: false,
	},
)

interface QuadrantsPresenterViewProps {
	exercise: ST["exercise"]
}

export const QuadrantsPresenterView = async ({
	exercise,
}: QuadrantsPresenterViewProps) => {
	const participants = await client.findAllParticipantsInExercise(exercise._id)

	return (
		<div className="h-[calc(100vh-5.5rem)] px-8 py-12">
			<QuadrantsPresenterViewClient
				exercise={exercise}
				participants={participants}
			/>
		</div>
	)
}
