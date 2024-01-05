import React from "react"
import { Button } from "@/components/Button"
import { PlusIcon } from "@/components/icons/Plus"
import { Text } from "@/components/Text"
import { submitListFieldAnswer } from "./actions"
import type { FormAnswer } from "./types"

type Props = {
	placeholder?: string
	rows?: number
	showAddButton?: boolean
	answers?: FormAnswer
	stepIdx: number
	exerciseId: string
}

export const ListField = ({
	rows: initialRows = 5,
	showAddButton = false,
	placeholder,
	answers,
	stepIdx,
	exerciseId,
}: Props) => {
	const answerData = answers?.data
	if (answerData && answerData.type !== "List")
		throw new Error("Invalid answer data found.")

	const [rows, setRows] = React.useState(
		answerData?.responses.length ?? initialRows,
	)
	const arr = new Array(rows).fill(0).map((_, idx) => idx + 1)

	const appendNewRow = () => {
		setRows((prev) => prev + 1)
	}

	return (
		<form action={submitListFieldAnswer}>
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
								defaultValue={answerData?.responses.at(idx)}
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

			<input type="hidden" name="exerciseId" value={exerciseId} />
			<input type="hidden" name="stepIdx" value={stepIdx} />
			<input type="submit" className="hidden" />
		</form>
	)
}
