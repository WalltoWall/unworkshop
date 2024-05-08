"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { match } from "ts-pattern"
import { FinalizeBanner } from "@/components/FinalizeBanner"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import { assertQuadrantsAnswer } from "../utils"
import { InstructionsBanner } from "./InstructionsBanner"
import { Quadrant } from "./Quadrant"

type StepState = "today_pending" | "tomorrow_pending" | "complete"

interface Props {
	exercise: ST.Exercise
	participant: NonNullable<ST.ParticipantQueryResult>
	groupSlug?: string
}

export const QuadrantsExercise = ({
	exercise,
	participant,
	groupSlug,
}: Props) => {
	const [state, setState] = React.useState<StepState>("today_pending")
	const params = useParams()
	const router = useRouter()
	const { answer, actions, role } = useGroupContext()
	assertQuadrantsAnswer(answer)

	if (
		!exercise.quadrants ||
		!exercise.finalize_instructions ||
		!exercise.tomorrow_instructions ||
		!exercise.tomorrow_instructions
	) {
		throw new Error("Invalid exercise found. Check quadrants configuration!")
	}

	// const isGroupExercise = Boolean(exercise.groups && exercise.groups.length > 0)

	const step = answer.step
	const stepIdx = step - 1

	const id = groupSlug ?? participant._id

	const allQuadrants = exercise.quadrants
	const allAnswers = answer.data[id] ?? []

	const quadrant = allQuadrants.at(stepIdx)
	// const stepAnswer = allAnswers.at(stepIdx)

	const onReviewScreen = stepIdx === allQuadrants.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	if (!quadrant) return null

	return (
		<div className="mt-6 flex flex-[1_1_0] flex-col gap-6">
			{onReviewScreen && (
				<div>
					<FinalizeBanner />
				</div>
			)}

			{!onReviewScreen && (
				<div className="flex flex-col items-center">
					{match(state)
						.with("today_pending", () => (
							<InstructionsBanner
								dotVariant="unfilled"
								value={exercise.today_instructions!}
							/>
						))
						.with("tomorrow_pending", () => (
							<InstructionsBanner
								dotVariant="filled"
								value={exercise.tomorrow_instructions!}
							/>
						))
						.with("complete", () => (
							<InstructionsBanner
								dotVariant="filled"
								value={exercise.finalize_instructions!}
							/>
						))
						.exhaustive()}

					<Quadrant quadrant={quadrant} className="self-stretch" />
				</div>
			)}

			<Steps
				steps={allQuadrants.length}
				activeStep={step}
				onFinish={goBackToExerciseList}
				className="mt-auto"
			/>
		</div>
	)
}
