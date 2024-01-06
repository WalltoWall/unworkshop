import React from "react"
import { match } from "ts-pattern"
import { Button } from "@/components/Button"
import { PlusIcon } from "@/components/icons/Plus"
import { Text } from "@/components/Text"
import { submitFieldAnswer } from "./actions"
import type {
	FieldProps,
	FormAnswer,
	FormField,
	FormStep,
	ListFieldAnswer,
} from "./types"
import { PositiveNumber } from "./validators"

const INPUT_NAME = "answer"

const AddButton = (props: {
	onClick?: React.MouseEventHandler<HTMLButtonElement>
	children: string
}) => {
	return (
		<Button
			color="black"
			uppercase={false}
			size="xs"
			outline
			rounded="sm"
			fontFamily="sans"
			className="mt-2.5"
			onClick={props.onClick}
			type="button"
		>
			<PlusIcon className="w-[18px]" />
			<span className="capsize">{props.children}</span>
		</Button>
	)
}

const Input = (props: {
	number: number
	placeholder?: string
	defaultValue?: string
}) => {
	return (
		<li className="flex gap-2">
			<div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-gray-90">
				<Text style="heading" size={16}>
					{props.number}
				</Text>
			</div>

			<input
				type="text"
				placeholder={props.placeholder}
				name={INPUT_NAME}
				className="h-9 grow rounded-lg border border-gray-90 px-2.5 text-black text-14 placeholder:text-gray-75"
				defaultValue={props.defaultValue}
			/>
		</li>
	)
}

type SourceListSectionProps = {
	heading: string
	field: FormField
	answer?: ListFieldAnswer
}

const SourceListSection = (props: SourceListSectionProps) => {
	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = props.field

	const [rows, setRows] = React.useState(
		props.answer?.responses.length ?? initialRows,
	)
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const appendNewRow = () => {
		setRows((prev) => prev + 1)
	}

	return (
		<div>
			<Text style="heading" size={24} className="uppercase">
				{props.heading}
			</Text>

			<ul className="mt-4 flex flex-col gap-2">
				{arr.map((number, idx) => {
					return (
						<Input
							key={number}
							number={number}
							placeholder={placeholder}
							defaultValue={props.answer?.responses.at(idx)}
						/>
					)
				})}
			</ul>

			{showAddButton && (
				<AddButton onClick={appendNewRow}>{addButtonText}</AddButton>
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

	const stepSrc = PositiveNumber.parse(props.field.source?.step)
	const fieldSrc = PositiveNumber.parse(props.field.source?.field)

	const sourceAnswer = props.allAnswers?.at(stepSrc - 1)?.data.at(fieldSrc - 1)
	const sourceField = props.allSteps?.at(stepSrc - 1)?.fields?.at(fieldSrc - 1)

	if (!sourceAnswer || !sourceField)
		throw new Error("No valid source found. Check field or step config.")

	const headings = match(sourceAnswer)
		.with({ type: "Narrow" }, (sa) => sa.responses)
		.with({ type: "List" }, (sa) => sa.responses)
		.otherwise(() => {
			throw new Error("Invalid source answer.")
		})

	return (
		<div className="space-y-6">
			{headings.map((heading) => (
				<SourceListSection
					key={heading}
					heading={heading}
					field={props.field}
					answer={answer}
				/>
			))}
		</div>
	)
}

const PlainListField = ({ answer, ...props }: Props) => {
	if (answer && answer.type !== "List")
		throw new Error("Invalid answer data found.")

	const {
		rows: initialRows = 5,
		showAddButton = false,
		placeholder,
		addButtonText = "Add another",
	} = props.field

	const [rows, setRows] = React.useState(
		answer?.responses.length ?? initialRows,
	)
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const appendNewRow = () => {
		setRows((prev) => prev + 1)
	}

	return (
		<>
			<ul className="flex flex-col gap-2">
				{arr.map((number, idx) => {
					return (
						<Input
							key={number}
							number={number}
							placeholder={placeholder}
							defaultValue={answer?.responses.at(idx)}
						/>
					)
				})}
			</ul>

			{showAddButton && (
				<AddButton onClick={appendNewRow}>{addButtonText}</AddButton>
			)}
		</>
	)
}

export const ListField = (props: Props) => {
	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [, startTransition] = React.useTransition()

	const submitForm = () => {
		if (!rForm.current) return

		const data = new FormData(rForm.current)
		const answers = data.getAll(INPUT_NAME).filter(Boolean) as string[]

		startTransition(() => {
			submitFieldAnswer({
				answer: { type: "List", responses: answers },
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

	return (
		<form onSubmit={handleSubmit} ref={rForm}>
			{props.field.source?.field && props.field.source.step ? (
				<SourceListField {...props} />
			) : (
				<PlainListField {...props} />
			)}

			<input type="submit" className="hidden" />
		</form>
	)
}
