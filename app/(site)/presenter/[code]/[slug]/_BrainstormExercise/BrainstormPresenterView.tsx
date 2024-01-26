import React from "react"
import dynamic from "next/dynamic"
import { type BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"

const BrainstormPresenterViewClient = dynamic(
	() => import("./BrainstormPresenterViewClient"),
	{ ssr: false },
)

type Props = { exercise: BrainstormExercise }

export const BrainstormPresenterView = async ({ exercise }: Props) => {
	return (
		<div className="px-8 pt-12">
			<BrainstormPresenterViewClient exercise={exercise} />
		</div>
	)
}
