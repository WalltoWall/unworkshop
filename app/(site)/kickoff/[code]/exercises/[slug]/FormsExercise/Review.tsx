import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import { FieldContainer } from "./FieldContainer"
import { FieldRenderer } from "./FieldRenderer"
import { Prompt } from "./Prompt"
import type { FormStepAnswer } from "./types"
import type { FormActions } from "./use-multiplayer-form"

type Props = {
	allAnswers?: FormStepAnswer[]
	actions: FormActions
	exercise: ST.Exercise
}

export const Review = ({ allAnswers = [], exercise, actions }: Props) => {
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
					const stepAnswer = allAnswers.at(stepIdx)
					if (!stepAnswer)
						throw new Error("No answer foudn for step: " + stepIdx + 1)

					const fieldAnswer = stepAnswer.at(fieldIdx)

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
								allAnswers={allAnswers}
								answer={fieldAnswer}
								readOnly
								actions={actions}
							/>
						</FieldContainer>
					)
				}),
			)}
		</div>
	)
}
