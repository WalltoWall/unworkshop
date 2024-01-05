import type { ST } from "@/sanity/config"
import { ListField } from "./ListField"
import { NarrowField } from "./NarrowField"
import type {
	FormAnswer,
	FormField,
	FormFieldAnswer,
	SharedFieldProps,
} from "./types"

type Props = {
	field: FormField
	answer?: FormFieldAnswer
	exercise: ST["exercise"]
	stepIdx: number
	fieldIdx: number
	allAnswers?: FormAnswer[]
}

export const FieldRenderer = ({
	field,
	answer,
	exercise,
	stepIdx,
	fieldIdx,
	allAnswers,
}: Props) => {
	const sharedProps: SharedFieldProps = {
		exerciseId: exercise._id,
		fieldIdx,
		stepIdx,
		answer,
	}

	switch (field.type) {
		case "List":
			return (
				<ListField
					key={field._key}
					placeholder={field.placeholder}
					rows={field.rows}
					showAddButton={field.showAddButton}
					{...sharedProps}
				/>
			)

		case "Narrow":
			if (!field.step)
				throw new Error(
					"Invalid Narrow field configuration. Step field is required.",
				)

			const sourceStepData = exercise.form?.steps?.at(field.step)
			const sourceStepAnswer = allAnswers?.at(field.step)
			if (!sourceStepData)
				throw new Error("No valid step data found for step: " + field.step)
			if (!sourceStepAnswer)
				throw new Error("No valid answer data found for step: " + field.step)

			return (
				<NarrowField
					key={field._key}
					max={field.max}
					min={field.min}
					sourceAnswer={sourceStepAnswer}
					sourceStep={sourceStepData}
					{...sharedProps}
				/>
			)

		default:
			throw new Error("Invalid field type.")
	}
}
