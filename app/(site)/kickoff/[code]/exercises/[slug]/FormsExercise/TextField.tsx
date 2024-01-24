import React from "react"
import debounce from "just-debounce-it"
import { match } from "ts-pattern"
import { submitFieldAnswer } from "./actions"
import { Textarea } from "./Textarea"
import type { FieldProps } from "./types"

type Props = FieldProps

const DEFAULT_INPUT_NAME = "answer"

export const TextField = ({ answer, ...props }: Props) => {
	if (answer && answer.type !== "Text")
		throw new Error("Invalid answer data found.")

	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [, startTransition] = React.useTransition()

	const submitForm = () => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)
		const answer = data.get(DEFAULT_INPUT_NAME) as string | null
		if (!answer) return

		startTransition(() => {
			submitFieldAnswer({
				answer: { type: "Text", response: answer },
				exerciseId: props.exerciseId,
				fieldIdx: props.fieldIdx,
				stepIdx: props.stepIdx,
			})
		})
	}

	const sharedProps = {
		name: DEFAULT_INPUT_NAME,
		placeholder: props.field.placeholder,
		onChange: debounce(submitForm, 300),
		defaultValue: answer?.response,
		readOnly: props.readOnly,
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	return (
		<form ref={rForm} onSubmit={handleSubmit}>
			{match(props.field.type)
				.with("Text", () => (
					<input
						type="text"
						className="h-9 w-full rounded-lg border border-gray-90 px-4 py-2.5 text-14 leading-copyMega"
						id={`field-${props.stepIdx}-${props.fieldIdx}`}
						{...sharedProps}
					/>
				))
				.with("Big Text", () => <Textarea {...sharedProps} />)
				.otherwise(() => {
					throw new Error("Unreachable!")
				})}
		</form>
	)
}
