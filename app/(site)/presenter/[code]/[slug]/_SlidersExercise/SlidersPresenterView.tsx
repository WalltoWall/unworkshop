import React from "react"
import dynamic from "next/dynamic"
import type { SlidersExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

const SlidersPresenterViewClient = dynamic(
	() => import("./SlidersPresenterViewClient"),
	{ ssr: false },
)

interface SlidersPresenterViewProps {
	exercise: SlidersExercise
}

export const SlidersPresenterView = async ({
	exercise,
}: SlidersPresenterViewProps) => {
	return (
		<div className="px-8 pt-12">
			<SlidersPresenterViewClient exercise={exercise} />
		</div>
	)
}
