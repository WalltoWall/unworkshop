import { unreachable } from "@/lib/unreachable"
import type * as ST from "@/sanity/types.gen"
import { ListField } from "./ListField"
import { NarrowField } from "./NarrowField"
import { TaglineField } from "./TaglineField"
import { TextField } from "./TextField"
import type {
	FormField,
	FormFieldAnswer,
	FormStepAnswer,
	SharedFieldProps,
} from "./types"
import type { FormActions } from "./use-multiplayer-form"
import { PositiveNumber } from "./validators"

type Props = {
	field: FormField
	answer?: FormFieldAnswer
	exercise: ST.Exercise
	stepIdx: number
	fieldIdx: number
	allAnswers?: FormStepAnswer[]
	readOnly?: boolean
	actions: FormActions
}

export const FieldRenderer = ({
	field,
	answer,
	exercise,
	stepIdx,
	fieldIdx,
	allAnswers,
	readOnly = false,
	actions,
}: Props) => {
	const sharedProps: SharedFieldProps = {
		exerciseId: exercise._id,
		fieldIdx,
		stepIdx,
		answer,
		field,
		readOnly,
		actions,
	}

	function getFieldSource() {
		const stepSrc = PositiveNumber.parse(field.source?.step)
		const fieldSrc = PositiveNumber.parse(field.source?.field)

		const sourceStepAnswer = allAnswers?.at(stepSrc - 1)
		const source = sourceStepAnswer?.at(fieldSrc - 1)

		if (!source)
			throw new Error("No valid source found. Check field or step config.")

		return source
	}

	switch (field.type) {
		case "List": {
			return (
				<ListField
					key={field._key}
					allAnswers={allAnswers}
					allSteps={exercise.form?.steps}
					{...sharedProps}
				/>
			)
		}

		case "Narrow":
			return (
				<NarrowField
					key={field._key}
					source={getFieldSource()}
					{...sharedProps}
				/>
			)

		case "Text":
		case "Big Text":
			return <TextField key={field._key} {...sharedProps} />

		case "Tagline":
			return (
				<TaglineField
					key={field._key}
					source={getFieldSource()}
					{...sharedProps}
				/>
			)

		default:
			return unreachable(field.type)
	}
}
