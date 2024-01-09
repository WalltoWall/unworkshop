"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { z } from "zod"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { FieldRenderer } from "./FieldRenderer"
import { Prompt } from "./Prompt"
import { Review } from "./Review"
import type { FormParticipant } from "./types"

const StepParamSchema = z.coerce
	.number()
	.catch(1)
	.default(1)
	.transform((val) => (val === 0 ? 1 : val))

type Props = {
	exercise: ST["exercise"]
	participant: FormParticipant
}

export const Form = ({ exercise, participant }: Props) => {
	const searchParams = useSearchParams()
	const router = useRouter()
	const params = useParams()

	const step = StepParamSchema.parse(searchParams.get("step"))
	const stepIdx = step - 1

	if (!exercise.form || !exercise.form.steps)
		throw new Error("No form exercise data found.")

	const stepData = exercise.form.steps.at(stepIdx)

	const answers = participant.answers?.[exercise._id]
	const stepAnswers = answers?.steps.at(stepIdx)

	const onReviewScreen = !stepData && stepIdx === exercise.form.steps.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-3">
			{onReviewScreen && (
				<Review answers={answers?.steps} exercise={exercise} />
			)}
			{!onReviewScreen &&
				stepData?.fields?.map((field, fieldIdx) => {
					const fieldAnswer = stepAnswers?.data.at(fieldIdx)

					return (
						<div
							className={clsx(
								"-mx-7 border-gray-90 px-7 py-6",
								fieldIdx !== stepData.fields!.length - 1 && "border-b-2",
							)}
							key={field._key}
						>
							<Prompt
								className="mb-5"
								num={fieldIdx + 1}
								additionalText={field.additionalText}
							>
								{field.prompt}
							</Prompt>

							<FieldRenderer
								exercise={exercise}
								field={field}
								stepIdx={stepIdx}
								fieldIdx={fieldIdx}
								allAnswers={answers?.steps}
								answer={fieldAnswer}
							/>
						</div>
					)
				})}

			<Steps
				steps={exercise.form.steps.length}
				activeStep={step}
				onFinish={goBackToExerciseList}
			/>
		</div>
	)
}
