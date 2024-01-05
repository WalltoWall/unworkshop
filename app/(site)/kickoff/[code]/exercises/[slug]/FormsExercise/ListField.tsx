import React from "react"
import { Button } from "@/components/Button"
import { PlusIcon } from "@/components/icons/Plus"
import { Text } from "@/components/Text"
import { submitFieldAnswer } from "./actions"
import type { FieldProps } from "./types"

type Props = FieldProps

export const ListField = ({
	answer,
	stepIdx,
	fieldIdx,
	exerciseId,
	field,
}: Props) => {
	if (answer && answer.type !== "List")
		throw new Error("Invalid answer data found.")

	const { rows: initialRows = 5, showAddButton = false, placeholder } = field

	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [isPending, startTransition] = React.useTransition()
	const [rows, setRows] = React.useState(
		answer?.responses.length ?? initialRows,
	)
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const appendNewRow = () => {
		setRows((prev) => prev + 1)
	}

	const submitForm = () => {
		if (!rForm.current) return

		const data = new FormData(rForm.current)
		const answers = data.getAll("answer").filter(Boolean) as string[]

		startTransition(() => {
			submitFieldAnswer({
				answer: { type: "List", responses: answers },
				exerciseId,
				fieldIdx,
				stepIdx,
			})
		})
	}

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault()
		submitForm()
	}

	return (
		<form onSubmit={handleSubmit} ref={rForm}>
			<ul className="flex flex-col gap-2">
				{arr.map((num, idx) => {
					return (
						<li key={num} className="flex gap-2">
							<div className="flex h-9 w-9 items-center justify-center rounded-[7px] bg-gray-90">
								<Text style="heading" size={16}>
									{num}
								</Text>
							</div>

							<input
								type="text"
								placeholder={placeholder}
								name="answer"
								className="h-9 grow rounded-lg border border-gray-90 px-2.5 text-black text-14 placeholder:text-gray-75"
								defaultValue={answer?.responses.at(idx)}
							/>
						</li>
					)
				})}
			</ul>

			{showAddButton && (
				<Button
					color="black"
					uppercase={false}
					size="xs"
					outline
					rounded="sm"
					fontFamily="sans"
					className="mt-2.5"
					onClick={appendNewRow}
					type="button"
				>
					<PlusIcon className="w-[18px]" />
					<span className="capsize">Add another</span>
				</Button>
			)}

			<input type="submit" className="hidden" />
		</form>
	)
}
