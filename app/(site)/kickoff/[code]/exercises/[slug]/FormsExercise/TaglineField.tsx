import React from "react"
import clsx from "clsx"
import { AddButton } from "./AddButton"
import { HighlightedResponses } from "./HighlightedResponses"
import { Prompt } from "./Prompt"
import { Textarea, textareaStyles } from "./Textarea"
import type { FieldProps, FormFieldAnswer } from "./types"
import { getOffLimitWords, sanitizeString } from "./utils"

const INPUT_NAME = "answer"

interface HighlighterTextareaProps
	extends Omit<React.ComponentPropsWithoutRef<"textarea">, "value"> {
	value: string
	offlimitWords?: string[]
}

const HighlighterTextarea = ({
	className,
	offlimitWords = [],
	...props
}: HighlighterTextareaProps) => {
	const words = props.value.split(" ")

	return (
		<div className={clsx(className, "relative flex rounded-lg")}>
			<Textarea className="text-black/0 caret-black" {...props} />

			<div
				className={clsx(
					textareaStyles,
					"pointer-events-none absolute inset-0 whitespace-pre-wrap border-gray-90/0",
				)}
			>
				{words.map((word, idx) => {
					const cleanWord = sanitizeString(word)
					const invalid =
						cleanWord.length > 1 &&
						offlimitWords.some((off) => cleanWord.includes(off))

					return (
						<span key={word + idx} className={clsx(invalid && "text-red-63")}>
							{word + (idx === words.length - 1 ? "" : " ")}
						</span>
					)
				})}
			</div>
		</div>
	)
}

type Props = FieldProps<{
	source: FormFieldAnswer
}>

export const TaglineField = ({ source, answer, actions, ...props }: Props) => {
	if (source.type !== "List")
		throw new Error(
			"Tagline fields only support List field answers as a source.",
		)
	if (answer && answer.type !== "Tagline")
		throw new Error("Invalid answer data found.")

	const answerOne = answer?.responses.at(0) ?? ""
	const answerTwo = answer?.responses.at(1)

	const handleChange = (answerOne: string, answerTwo?: string) => {
		const answers = [answerOne]
		if (typeof answerTwo === "string") answers.push(answerTwo)

		actions.submitFieldAnswer({
			answer: { type: "Tagline", responses: answers },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const sourceResponses = source.groups.at(0)?.responses ?? []
	const offlimitWords = getOffLimitWords(sourceResponses)

	const sharedInputProps = {
		className: "mt-5",
		name: INPUT_NAME,
		readOnly: props.readOnly,
		offlimitWords,
		placeholder: props.field.placeholder,
	}

	// TODO: The children type of <Prompt> only accepts strings, not React
	// nodes. This is usually fine, but since we have an expression here things
	// kind of break. Just need to not be lazy and change the prompt field in
	// the CMS to be a rich text field.
	const prompt = `Your brand in ${sourceResponses.length.toString()} words.`

	return (
		<div>
			<Prompt num={props.fieldIdx + 1}>{prompt}</Prompt>

			<HighlightedResponses
				responses={sourceResponses}
				answers={[answerOne, answerTwo ?? ""]}
				className="mt-5"
			/>

			<Prompt
				className="mt-8"
				num={props.fieldIdx + 2}
				additionalText={props.field.additionalText}
			>
				{props.field.prompt}
			</Prompt>

			<HighlighterTextarea
				value={answerOne}
				onChange={(e) => handleChange(e.currentTarget.value, answerTwo)}
				{...sharedInputProps}
			/>

			{typeof answerTwo === "undefined" && !props.readOnly && (
				<AddButton
					className="mt-2.5"
					onClick={() => handleChange(answerOne, "")}
				>
					Add another response
				</AddButton>
			)}

			{typeof answerTwo !== "undefined" && (
				<HighlighterTextarea
					value={answerTwo}
					onChange={(e) => handleChange(answerOne, e.currentTarget.value)}
					{...sharedInputProps}
				/>
			)}
		</div>
	)
}
