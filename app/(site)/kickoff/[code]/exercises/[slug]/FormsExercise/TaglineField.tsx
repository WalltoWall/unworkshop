import React from "react"
import clsx from "clsx"
import debounce from "just-debounce-it"
import { submitFieldAnswer } from "./actions"
import { AddButton } from "./AddButton"
import { HighlightedResponses } from "./HighlightedResponses"
import { Prompt } from "./Prompt"
import { Textarea, textareaStyles } from "./Textarea"
import type { FieldProps, FormFieldAnswer } from "./types"
import { getOffLimitWords, sanitizeString } from "./utils"
import { AnswersArray } from "./validators"

const INPUT_NAME = "answer"

type HighlighterTextareaProps = Omit<
	React.ComponentPropsWithoutRef<"textarea">,
	"value"
> & {
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
					"pointer-events-none absolute inset-0 border-gray-90/0",
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

export const TaglineField = ({ source, answer, ...props }: Props) => {
	if (source.type !== "List")
		throw new Error(
			"Tagline fields only support List field answers as a source.",
		)
	if (answer && answer.type !== "Tagline")
		throw new Error("Invalid answer data found.")

	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [answerOne, setAnswerOne] = React.useState(
		() => answer?.responses.at(0) ?? "",
	)
	const [answerTwo, setAnswerTwo] = React.useState(
		() => answer?.responses.at(1) ?? null,
	)
	const [, startTransition] = React.useTransition()

	const submitForm = React.useCallback(() => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)
		const answers = AnswersArray.parse(data.getAll(INPUT_NAME))

		startTransition(() => {
			submitFieldAnswer({
				answer: { type: "Tagline", responses: answers },
				exerciseId: props.exerciseId,
				fieldIdx: props.fieldIdx,
				stepIdx: props.stepIdx,
			})
		})
	}, [props.exerciseId, props.fieldIdx, props.readOnly, props.stepIdx])

	const debouncedSubmit = React.useMemo(
		() => debounce(submitForm, 300),
		[submitForm],
	)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	const handleChange = (
		value: string,
		setState:
			| React.Dispatch<React.SetStateAction<string>>
			| React.Dispatch<React.SetStateAction<string | null>>,
	) => {
		setState(value)
		debouncedSubmit()
	}

	const sourceResponses = source.groups.at(0)?.responses ?? []
	const offlimitWords = getOffLimitWords(sourceResponses)

	const sharedInputProps = {
		className: "mt-5",
		name: INPUT_NAME,
		readOnly: props.readOnly,
		offlimitWords,
		placeholder: props.field.placeholder,
		id: `field-${props.stepIdx}-${props.fieldIdx}-${INPUT_NAME}`,
	}

	// TODO: The children type of <Prompt> only accepts strings, not React
	// nodes. This is usually fine, but since we have an expression here things
	// kind of break. Just need to not be lazy and change the prompt field in
	// the CMS to be a rich text field.
	const prompt = `Your brand in ${sourceResponses.length.toString()} words.`

	return (
		<form ref={rForm} onSubmit={handleSubmit}>
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
				onChange={(e) => handleChange(e.currentTarget.value, setAnswerOne)}
				{...sharedInputProps}
			/>

			{answerTwo === null && !props.readOnly && (
				<AddButton className="mt-2.5" onClick={() => setAnswerTwo("")}>
					Add another response
				</AddButton>
			)}

			{answerTwo !== null && (
				<HighlighterTextarea
					value={answerTwo}
					onChange={(e) => handleChange(e.currentTarget.value, setAnswerTwo)}
					{...sharedInputProps}
				/>
			)}
		</form>
	)
}
