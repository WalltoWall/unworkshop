"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { FieldContainer } from "./FieldContainer"
import { FieldRenderer } from "./FieldRenderer"
import { Prompt } from "./Prompt"
import { Review } from "./Review"
import type { FormParticipant } from "./types"
import { useMultiplayerForm } from "./use-multiplayer-form"

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
	const { actions, multiplayer, snap } = useMultiplayerForm({
		exerciseId: exercise._id,
		participantId: participant._id,
	})

	console.log(snap)

	const step = StepParamSchema.parse(searchParams.get("step"))
	const stepIdx = step - 1

	if (!exercise.form || !exercise.form.steps)
		throw new Error("No form exercise data found.")

	const stepData = exercise.form.steps.at(stepIdx)

	// Or group id?
	const answers = snap.participants[participant._id] ?? []
	const stepAnswers = answers.at(stepIdx)

	const onReviewScreen = !stepData && stepIdx === exercise.form.steps.length

	const goBackToExerciseList = () =>
		router.push(`/kickoff/${params.code}/exercises`)

	return (
		<div className="mt-3 flex flex-[1_1_0] flex-col justify-between">
			{onReviewScreen && (
				<Review allAnswers={answers} exercise={exercise} actions={actions} />
			)}

			{!onReviewScreen && (
				<div>
					{stepData?.fields?.map((field, fieldIdx) => {
						const fieldAnswer = stepAnswers?.at(fieldIdx)

						return (
							<FieldContainer key={field._key}>
								{field.type !== "Tagline" && (
									<Prompt
										className="mb-5"
										num={fieldIdx + 1}
										additionalText={field.additionalText}
									>
										{field.prompt}
									</Prompt>
								)}

								<FieldRenderer
									exercise={exercise}
									field={field}
									stepIdx={stepIdx}
									fieldIdx={fieldIdx}
									allAnswers={answers}
									answer={fieldAnswer}
									actions={actions}
								/>
							</FieldContainer>
						)
					})}
				</div>
			)}

			<Steps
				steps={exercise.form.steps.length}
				activeStep={step}
				onFinish={goBackToExerciseList}
			/>
		</div>
	)
}

export default Form
