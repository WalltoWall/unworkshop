"use client"

import React from "react"
import { match } from "ts-pattern"
import type {
	FormField,
	FormFieldAnswer,
	FormParticipant,
	FormStepAnswer,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import type { FormPresenterViewSettings } from "./FormResponses"
import { ListResponseCard } from "./ListResponseCard"
import { NarrowResponseCard } from "./NarrowResponseCard"
import { TaglineResponseCard } from "./TaglineResponseCard"
import { TextResponseCard } from "./TextResponseCard"

export type ResponseCardProps<T extends FormFieldAnswer = FormFieldAnswer> = {
	answer: T
	allParticipantAnswers: FormStepAnswer[]
	participant: FormParticipant
	field: FormField
	settings: FormPresenterViewSettings
	participantNumber: number
	questionNumber: number
}

export const ResponseCard = (props: ResponseCardProps) => {
	return match(props.answer)
		.with({ type: "List" }, (answer) => (
			<ListResponseCard {...props} answer={answer} />
		))
		.with({ type: "Narrow" }, (answer) => (
			<NarrowResponseCard {...props} answer={answer} />
		))
		.with({ type: "Text" }, (answer) => (
			<TextResponseCard {...props} answer={answer} />
		))
		.with({ type: "Tagline" }, (answer) => (
			<TaglineResponseCard {...props} answer={answer} />
		))
		.exhaustive()
}
