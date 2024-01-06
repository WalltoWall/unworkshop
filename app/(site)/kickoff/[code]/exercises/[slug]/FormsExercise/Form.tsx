"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { ArrowRight } from "@/components/icons/ArrowRight"
import { Steps } from "@/components/Steps"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { FieldRenderer } from "./FieldRenderer"
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
	const pathname = usePathname()

	const step = StepParamSchema.parse(searchParams.get("step"))
	const stepIdx = step - 1

	if (!exercise.form || !exercise.form.steps)
		throw new Error("No form exercise data found.")

	const stepData = exercise.form.steps.at(stepIdx)
	if (!stepData) throw new Error("Invalid exercise data.")

	const answers = participant.answers?.[exercise._id]
	const stepAnswers = answers?.steps.at(stepIdx)

	const goToNextStep = (step: number) => {
		const resolvedStep = step + 1
		const sParams = new URLSearchParams({ step: resolvedStep.toString() })

		router.push(pathname + "?" + sParams.toString())
	}

	return (
		<div className="mt-6">
			{stepData.fields?.map((field, idx) => {
				const fieldAnswer = stepAnswers?.data.at(idx)

				return (
					<React.Fragment key={field._key}>
						<div className="mb-5 flex items-start gap-2">
							<div className="flex -translate-y-px items-center gap-0.5 text-gray-50">
								<Text asChild style="heading" size={16}>
									<p>{idx + 1}</p>
								</Text>

								<ArrowRight className="w-[13px]" />
							</div>

							<div className="space-y-3">
								<Text asChild size={16} style="copy">
									<h2>{field.prompt}</h2>
								</Text>

								{field.additionalText && (
									<Text size={12} className="text-gray-50">
										{field.additionalText}
									</Text>
								)}
							</div>
						</div>

						<FieldRenderer
							exercise={exercise}
							field={field}
							stepIdx={stepIdx}
							fieldIdx={idx}
							allAnswers={answers?.steps}
							answer={fieldAnswer}
						/>
					</React.Fragment>
				)
			})}

			<Steps
				count={exercise.form.steps.length}
				active={stepIdx}
				onActiveChange={goToNextStep}
			/>
		</div>
	)
}
