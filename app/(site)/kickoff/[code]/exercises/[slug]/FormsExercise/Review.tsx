import clsx from "clsx"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { FieldContainer } from "./FieldContainer"
import { FieldRenderer } from "./FieldRenderer"
import { Prompt } from "./Prompt"
import type { FormAnswer } from "./types"

type Props = {
	answers?: FormAnswer[]
	exercise: ST["exercise"]
}

export const Review = ({ answers = [], exercise }: Props) => {
	const steps = exercise.form!.steps ?? []

	return (
		<div>
			<Text
				style="heading"
				size={18}
				className="mt-6 rounded-2xl bg-gray-97 px-8 py-6 text-center"
			>
				Please, finalize your answers
			</Text>

			{steps.map((step, stepIdx) =>
				step.fields?.map((field, fieldIdx) => {
					const stepAnswer = answers.at(stepIdx)
					if (!stepAnswer)
						throw new Error("No answer found for step: " + stepIdx + 1)

					const fieldAnswer = stepAnswer.data.at(fieldIdx)

					return (
						<FieldContainer key={field._key}>
							<Prompt
								className="mb-5"
								num={stepIdx + fieldIdx + 1}
								additionalText={field.additionalText}
							>
								{field.prompt}
							</Prompt>

							<FieldRenderer
								exercise={exercise}
								field={field}
								stepIdx={stepIdx}
								fieldIdx={fieldIdx}
								allAnswers={answers}
								answer={fieldAnswer}
								readOnly
							/>
						</FieldContainer>
					)
				}),
			)}
		</div>
	)
}
