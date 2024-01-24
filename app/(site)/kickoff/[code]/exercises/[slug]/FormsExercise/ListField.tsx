import React from "react"
import debounce from "just-debounce-it"
import { match } from "ts-pattern"
import { Text } from "@/components/Text"
import { submitFieldAnswer } from "./actions"
import { AddButton } from "./AddButton"
import type {
	FieldProps,
	FormAnswer,
	FormField,
	FormStep,
	ListFieldAnswer,
} from "./types"
import { AnswersArray, PositiveNumber } from "./validators"

const DEFAULT_INPUT_NAME = "answer"

type InputProps = {
	number: number
	placeholder?: string
	defaultValue?: string
	onChange?: React.ChangeEventHandler<HTMLInputElement>
	name?: string
	readOnly?: boolean
	id: string
}

const Input = ({
	number,
	placeholder,
	defaultValue,
	onChange,
	name = DEFAULT_INPUT_NAME,
	readOnly = false,
	id,
}: InputProps) => {
	return (
		<li className="flex gap-2">
			<div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-gray-90">
				<Text style="heading" size={16}>
					{number}
				</Text>
			</div>

			<input
				type="text"
				placeholder={placeholder}
				name={name}
				className="h-9 grow rounded-lg border border-gray-90 px-2.5 text-black text-14 placeholder:text-gray-75"
				defaultValue={defaultValue}
				onChange={onChange}
				readOnly={readOnly}
				id={id}
			/>
		</li>
	)
}

type SourceListSectionProps = {
	label: string
	field: FormField
	answer?: ListFieldAnswer["groups"][number]
	onInputChange?: React.ChangeEventHandler<HTMLInputElement>
	readOnly?: boolean
	stepIdx: number
	fieldIdx: number
}

const SourceListSection = (props: SourceListSectionProps) => {
	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = props.field

	const answerCount = props.answer?.responses.length ?? 0
	const [rows, setRows] = React.useState(Math.max(answerCount, initialRows))
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const appendNewRow = () => setRows((prev) => prev + 1)

	return (
		<div>
			<Text style="heading" size={24} className="uppercase">
				{props.label}
			</Text>

			<ul className="mt-4 flex flex-col gap-2">
				{arr.map((number, idx) => {
					return (
						<Input
							key={number}
							number={number}
							placeholder={placeholder}
							defaultValue={props.answer?.responses.at(idx)}
							name={props.label}
							onChange={props.onInputChange}
							readOnly={props.readOnly}
							id={`field-${props.stepIdx}-${props.fieldIdx}-${props.label}-${idx}`}
						/>
					)
				})}
			</ul>

			{showAddButton && (
				<AddButton className="mt-2.5" onClick={appendNewRow}>
					{addButtonText}
				</AddButton>
			)}
		</div>
	)
}

type Props = FieldProps & {
	allAnswers?: FormAnswer[]
	allSteps?: FormStep[]
}

const SourceListField = ({ answer, ...props }: Props) => {
	if (answer && answer.type !== "List")
		throw new Error("Invalid answer data found.")

	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [, startTransition] = React.useTransition()

	const stepSrc = PositiveNumber.parse(props.field.source?.step)
	const fieldSrc = PositiveNumber.parse(props.field.source?.field)

	const sourceAnswer = props.allAnswers?.at(stepSrc - 1)?.data.at(fieldSrc - 1)
	const sourceField = props.allSteps?.at(stepSrc - 1)?.fields?.at(fieldSrc - 1)

	if (!sourceAnswer || !sourceField)
		throw new Error("No valid source found. Check field or step config.")

	const labels = match(sourceAnswer)
		.with({ type: "Narrow" }, (sa) => sa.responses)
		.otherwise(() => {
			throw new Error("Invalid source answer.")
		})

	const submitForm = () => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)

		startTransition(() => {
			submitFieldAnswer({
				answer: {
					type: "List",
					groups: labels.map((label) => ({
						label,
						responses: AnswersArray.parse(data.getAll(label)),
					})),
				},
				exerciseId: props.exerciseId,
				fieldIdx: props.fieldIdx,
				stepIdx: props.stepIdx,
			})
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	const onInputChange = debounce(submitForm, 300)

	return (
		<form ref={rForm} className="space-y-6" onSubmit={handleSubmit}>
			{labels.map((label) => (
				<SourceListSection
					key={label}
					label={label}
					field={props.field}
					answer={answer?.groups.find((a) => a.label === label)}
					onInputChange={onInputChange}
					readOnly={props.readOnly}
					stepIdx={props.stepIdx}
					fieldIdx={props.fieldIdx}
				/>
			))}
		</form>
	)
}

const PlainListField = ({ answer, ...props }: Props) => {
	if (answer && answer.type !== "List")
		throw new Error("Invalid answer data found.")

	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [, startTransition] = React.useTransition()

	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = props.field

	const resolvedAnswer = answer?.groups.at(0)
	const answerCount = resolvedAnswer?.responses.length ?? 0
	const [rows, setRows] = React.useState(Math.max(answerCount, initialRows))
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const submitForm = () => {
		if (!rForm.current || props.readOnly) return

		const data = new FormData(rForm.current)
		const answers = AnswersArray.parse(data.getAll(DEFAULT_INPUT_NAME))

		startTransition(() => {
			submitFieldAnswer({
				answer: { type: "List", groups: [{ responses: answers }] },
				exerciseId: props.exerciseId,
				fieldIdx: props.fieldIdx,
				stepIdx: props.stepIdx,
			})
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	const onChange = debounce(submitForm, 300)

	const appendNewRow = () => setRows((prev) => prev + 1)

	return (
		<form onSubmit={handleSubmit} ref={rForm}>
			<ul className="flex flex-col gap-2">
				{arr.map((number, idx) => {
					return (
						<Input
							key={number}
							number={number}
							placeholder={placeholder}
							defaultValue={resolvedAnswer?.responses.at(idx)}
							onChange={onChange}
							readOnly={props.readOnly}
							id={`field-${props.stepIdx}-${props.fieldIdx}-${idx}`}
						/>
					)
				})}
			</ul>

			{showAddButton && !props.readOnly && (
				<AddButton onClick={appendNewRow} className="mt-2.5">
					{addButtonText}
				</AddButton>
			)}

			<input type="submit" className="hidden" />
		</form>
	)
}

export const ListField = (props: Props) => {
	return (
		<>
			{props.field.source?.field && props.field.source.step ? (
				<SourceListField {...props} />
			) : (
				<PlainListField {...props} />
			)}
		</>
	)
}
