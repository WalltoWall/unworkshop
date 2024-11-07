"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { match, P } from "ts-pattern"
import { FinalizeBanner } from "@/components/FinalizeBanner"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { useGroupContext } from "@/groups/group-context"
import type { QuadrantStepState } from "../types"
import { assertQuadrantsAnswer } from "../utils"
import { InstructionsBanner } from "./InstructionsBanner"
import { Quadrant } from "./Quadrant"

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
	const params = useParams()
	const router = useRouter()
	const { answer, role } = useGroupContext()
	assertQuadrantsAnswer(answer)

	if (
		!exercise.quadrants ||
		!exercise.finalize_instructions ||
		!exercise.tomorrow_instructions ||
		!exercise.tomorrow_instructions
	) {
		throw new Error("Invalid exercise found. Check quadrants configuration!")
	}

	const isGroupExercise = Boolean(exercise.groups && exercise.groups.length > 0)

	const step = answer.step
	const stepIdx = step - 1

	const id = groupSlug ?? participant._id

	const allQuadrants = exercise.quadrants
	const allAnswers = answer.data[id] ?? []

	const quadrant = allQuadrants.at(stepIdx)
	const stepAnswer = allAnswers.at(stepIdx)

	if (!quadrant) return null

	const state = match(stepAnswer)
		.with({ today: P.any, tomorrow: P.any }, () => "complete")
		.with(
			{ today: P.any, tomorrow: P.optional(P.any) },
			() => "tomorrow_pending",
		)
		.otherwise(() => "today_pending") as QuadrantStepState

	const onReviewScreen = stepIdx === allQuadrants.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-6 flex flex-[1_1_0] flex-col gap-6">
			{onReviewScreen && (
				<div>
					<FinalizeBanner />
				</div>
			)}

			{!onReviewScreen && (
				<div className="flex flex-col items-center gap-8">
					<InstructionsBanner
						dotVariant={match(state)
							.with("today_pending", () => "unfilled" as const)
							.otherwise(() => "filled")}
						value={match(state)
							.with("today_pending", () => exercise.today_instructions!)
							.with("tomorrow_pending", () => exercise.tomorrow_instructions!)
							.with("complete", () => exercise.finalize_instructions!)
							.exhaustive()}
					/>

					<Quadrant
						quadrant={quadrant}
						className="self-stretch"
						readOnly={isGroupExercise && role !== "captain"}
						state={state}
						stepAnswer={stepAnswer}
						stepIdx={stepIdx}
						id={id}
					/>
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
