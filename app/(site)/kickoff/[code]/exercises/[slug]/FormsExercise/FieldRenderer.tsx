import { z } from "zod"
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

const PositiveNumber = z.number().positive()

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
			const stepSrc = PositiveNumber.parse(field.source?.step)
			const fieldSrc = PositiveNumber.parse(field.source?.field)

			const sourceStepAnswer = allAnswers?.at(stepSrc - 1)
			const source = sourceStepAnswer?.data.at(fieldSrc - 1)

			if (!source)
				throw new Error("No valid source found. Check field or step config.")

			return <NarrowField key={field._key} source={source} {...sharedProps} />

		default:
			throw new Error("Invalid field type.")
	}
}
