import type { ST } from "@/sanity/types.gen"
import type { Group } from "../groups/types"
import type { FormActions } from "./use-multiplayer-form"

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

export type FormStepAnswer = Array<FormFieldAnswer>

export type FormStep = NonNullable<
	NonNullable<ST["exercise"]["form"]>["steps"]
>[number]

export type FormField = NonNullable<FormStep["fields"]>[number]

export type FormParticipant = ST["participant"]

export type FormAnswers = {
	participants: Record<string, Array<FormStepAnswer>>
	groups: Record<string, Group>
}

export type FormExercise = ST["exercise"] & {
	answers: FormAnswers
}

export type SharedFieldProps = {
	answer?: FormFieldAnswer
	exerciseId: string
	stepIdx: number
	fieldIdx: number
	field: FormField
	readOnly: boolean
	actions: FormActions
}

export type FieldProps<T = unknown> = T & SharedFieldProps
