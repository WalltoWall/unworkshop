import React from "react"
import { match } from "ts-pattern"
import { Text } from "@/components/Text"
import { Textarea } from "./Textarea"
import type { FieldProps, FormFieldAnswer } from "./types"

type Props = FieldProps<{
	source?: FormFieldAnswer
}>

const DEFAULT_INPUT_NAME = "answer"

export const TextField = ({
	answer,
	actions,
	source,
	field,
	...props
}: Props) => {
	if (answer && answer.type !== "Text") {
		throw new Error("Invalid answer data found.")
	}

	if (source && source.type !== "Narrow") {
		throw new Error(
			"Invalid source for Text field found. Must be a 'Narrow' source.",
		)
	}

	let label: string | undefined
	if (field.source?.answer && field.source.answer > 0) {
		label = source?.responses.at(field.source.answer - 1)
	}

	const onChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		actions.submitFieldAnswer({
			answer: { type: "Text", response: e.target.value },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const sharedProps = {
		name: DEFAULT_INPUT_NAME,
		placeholder: field.placeholder,
		onChange,
		value: answer?.response,
		readOnly: props.readOnly,
	}

	return (
		<div>
			{label && (
				<Text style="heading" size={24} className="mb-3 uppercase">
					{label}
				</Text>
			)}

			{match(field.type)
				.with("Text", () => (
					<input
						type="text"
						className="h-9 w-full rounded-lg border border-gray-90 px-4 py-2.5 text-16 leading-copyMega"
						{...sharedProps}
					/>
				))
				.with("Big Text", () => <Textarea {...sharedProps} />)
				.otherwise(() => {
					throw new Error("Unreachable!")
				})}
		</div>
	)
}
