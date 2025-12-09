import React from "react"
import clsx from "clsx"
import { clone } from "remeda"
import { AddButton } from "./AddButton"
import { HighlightedResponses } from "./HighlightedResponses"
import { Prompt } from "./Prompt"
import { Textarea, textareaStyles, type TextareaSize } from "./Textarea"
import type { FieldProps, FormFieldAnswer } from "./types"
import { getBadWords, getTaglineVariant, sanitizeString } from "./utils"

const INPUT_NAME = "answer"
const DEFAULT_RESPONSE_COUNT = 2

interface HighlighterTextareaProps
	extends Omit<React.ComponentPropsWithoutRef<"textarea">, "value"> {
	value: string
	badWords: Set<string>
	invalidClassName?: string
	textareaSize?: TextareaSize
}

const HighlighterTextarea = ({
	className,
	badWords,
	invalidClassName = "text-red-63",
	textareaSize,
	...props
}: HighlighterTextareaProps) => {
	const words = props.value.split(" ")

	return (
		<div className={clsx(className, "relative flex rounded-lg")}>
			<Textarea
				className="text-black/0 caret-black"
				size={textareaSize}
				{...props}
			/>

			<div
				className={clsx(
					textareaStyles,
					"pointer-events-none absolute inset-0 whitespace-pre-wrap border-gray-90/0",
				)}
			>
				{words.map((_word, idx) => {
					const word = sanitizeString(_word)
					const invalid = badWords.has(word)

					return (
						<span
							key={_word + idx}
							className={clsx(invalid && invalidClassName)}
						>
							{_word + (idx === words.length - 1 ? "" : " ")}
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
	if (source.type !== "List") {
		throw new Error(
			"Tagline fields only support List field answers as a source.",
		)
	}

	if (answer && answer.type !== "Tagline") {
		throw new Error("Invalid answer data found.")
	}

	const variant = getTaglineVariant(props.field.color ?? "red")

	const answerOne = answer?.responses.at(0) ?? ""
	const answerTwo = answer?.responses.at(1)

	const handleChange = (value: string, idx: number) => {
		const cloned = clone(answer?.responses ?? [])
		cloned[idx] = value

		actions.submitFieldAnswer({
			answer: { type: "Tagline", responses: cloned },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const addAdditionalResponse = () => {
		const cloned = clone(answer?.responses ?? [])
		cloned.push("")

		actions.submitFieldAnswer({
			answer: { type: "Tagline", responses: cloned },
			fieldIdx: props.fieldIdx,
			stepIdx: props.stepIdx,
		})
	}

	const sourceResponses = source.groups.at(0)?.responses.filter(Boolean) ?? []
	const badWords = getBadWords(sourceResponses)

	const sharedInputProps = {
		className: "mt-5",
		name: INPUT_NAME,
		readOnly: props.readOnly,
		badWords,
		placeholder: props.field.placeholder,
	}

	// HACK: The children type of <Prompt> only accepts strings, not React
	// nodes. This is usually fine, but since we have an expression here things
	// kind of break. Just need to not be lazy and change the prompt field in
	// the CMS to be a rich text field.
	const prompt = `Your brand in ${sourceResponses.length.toString()} words.`

	const allowMultiple = props.field.allowMultiple ?? true
	const maxResponses = props.field.responseCount ?? DEFAULT_RESPONSE_COUNT
	const responseCount = answer?.responses.length ?? 0

	const showAddButton = allowMultiple && responseCount < maxResponses

	return (
		<div>
			<Prompt num={props.fieldIdx + 1}>{prompt}</Prompt>

			<HighlightedResponses
				responses={sourceResponses}
				answers={[answerOne, answerTwo]}
				invalidClassName={variant.invalidBgCn}
				className="mt-5"
			/>

			<Prompt
				className="mt-8"
				num={props.fieldIdx + 2}
				additionalText={props.field.additionalText}
			>
				{props.field.prompt}
			</Prompt>

			{allowMultiple ? (
				<>
					{answer?.responses.map((r, idx) => (
						<HighlighterTextarea
							key={idx}
							value={r}
							invalidClassName={variant.invalidTextCn}
							onChange={(e) => handleChange(e.currentTarget.value, idx)}
							textareaSize="default"
							{...sharedInputProps}
						/>
					))}

					{showAddButton && (
						<AddButton className="mt-2.5" onClick={addAdditionalResponse}>
							Add another response
						</AddButton>
					)}
				</>
			) : (
				<HighlighterTextarea
					value={answer?.responses.at(0) ?? ""}
					invalidClassName={variant.invalidTextCn}
					onChange={(e) => handleChange(e.currentTarget.value, 0)}
					textareaSize="default"
					{...sharedInputProps}
				/>
			)}
		</div>
	)
}
