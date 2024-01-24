import type { ST } from "@/sanity/config"
import type { GroupAnswer, IndividualAnswer } from "@/types"

export type ListFieldAnswer = {
	type: "List"
	groups: Array<{
		label?: string
		responses: string[]
	}>
}

export type TextFieldAnswer = {
	type: "Text"
	response: string
}

export type NarrowFieldAnswer = {
	type: "Narrow"
	responses: string[]
}

export type TaglineFieldAnswer = {
	type: "Tagline"
	responses: string[]
}

export type FormFieldAnswer =
	| ListFieldAnswer
	| TextFieldAnswer
	| NarrowFieldAnswer
	| TaglineFieldAnswer

export type FormAnswer = {
	data: Array<FormFieldAnswer>
}

export type FormStep = NonNullable<
	NonNullable<ST["exercise"]["form"]>["steps"]
>[number]

export type FormField = NonNullable<FormStep["fields"]>[number]

// TODO: Create a shared type for the mapped exercise ids.
export type FormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			steps: Array<FormAnswer>
		}
	}
}

export type SharedFieldProps = {
	answer?: FormFieldAnswer
	exerciseId: string
	stepIdx: number
	fieldIdx: number
	field: FormField
	readOnly: boolean
}

export type FieldProps<T = unknown> = T & SharedFieldProps
