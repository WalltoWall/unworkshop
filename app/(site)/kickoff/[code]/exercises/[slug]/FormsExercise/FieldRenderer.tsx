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
		field,
	}

	switch (field.type) {
		case "List":
			return <ListField key={field._key} {...sharedProps} />

		case "Narrow":
			if (!field.step)
				throw new Error("Invalid Narrow field configuration. Step is required.")
			if (!field.field)
				throw new Error(
					"Invalid Narrow field configuration. Field is required.",
				)

			const sourceStepAnswer = allAnswers?.at(field.step - 1)
			const source = sourceStepAnswer?.data.at(field.field - 1)

			if (!source)
				throw new Error("No valid source found. Check field or step config.")

			return <NarrowField key={field._key} source={source} {...sharedProps} />

		default:
			throw new Error("Invalid field type.")
	}
}
