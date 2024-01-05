"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { ArrowRight } from "@/components/icons/ArrowRight"
import { Steps } from "@/components/Steps"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { ListField } from "./ListField"
import { NarrowField } from "./NarrowField"
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

	const goToNextStep = (newStep: number) => {
		// TODO: This step is always one behind?
		const resolvedStep = newStep + 1
		const sParams = new URLSearchParams({ step: resolvedStep.toString() })

		router.push(pathname + "?" + sParams.toString())
	}

	return (
		<div className="mt-6">
			<div className="flex items-start gap-2">
				<div className="flex -translate-y-px items-center gap-0.5 text-gray-50">
					<Text asChild style="heading" size={16}>
						<p>{step}</p>
					</Text>

					<ArrowRight className="w-[13px]" />
				</div>

				<div className="space-y-3">
					<Text asChild size={16} style="copy">
						<h2>{stepData.prompt}</h2>
					</Text>

					{stepData.additionalText && (
						<Text size={12} className="text-gray-50">
							{stepData.additionalText}
						</Text>
					)}
				</div>
			</div>

			<div className="mt-4">
				{stepData.fields?.map((field) => {
					switch (field.type) {
						case "List":
							return (
								<ListField
									key={field._key}
									placeholder={field.placeholder}
									rows={field.rows}
									showAddButton={field.showAddButton}
									answers={stepAnswers}
									exerciseId={exercise._id}
									stepIdx={stepIdx}
								/>
							)

						case "Narrow":
							return <NarrowField key={field._key} />

						default:
							throw new Error("Invalid field type.")
					}
				})}
			</div>

			<Steps
				count={exercise.form.steps.length}
				active={stepIdx}
				onActiveChange={goToNextStep}
			/>
		</div>
	)
}
