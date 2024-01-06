import { CheckIcon } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { Text } from "@/components/Text"
import { pluralize } from "@/lib/pluralize"
import { submitFieldAnswer } from "./actions"
import type { FieldProps, FormFieldAnswer, ListFieldAnswer } from "./types"

const INPUT_NAME = "answer"

type NarrowListFieldProps = Omit<Props, "source"> & {
	source: ListFieldAnswer
}

const NarrowListField = ({ answer, ...props }: NarrowListFieldProps) => {
	if (answer && answer.type !== "Narrow")
		throw new Error("Invalid answer data found.")

	const { max = Infinity } = props.field
	const rForm = React.useRef<React.ElementRef<"form">>(null)
	const [, startTransition] = React.useTransition()

	const submitForm = () => {
		if (!rForm.current) return

		const data = new FormData(rForm.current)
		const answers = data.getAll(INPUT_NAME) as string[]

		startTransition(() => {
			submitFieldAnswer({
				answer: { type: "Narrow", responses: answers },
				exerciseId: props.exerciseId,
				fieldIdx: props.fieldIdx,
				stepIdx: props.stepIdx,
			})
		})
	}

	const handleChange: React.MouseEventHandler<HTMLInputElement> = (e) => {
		if (!rForm.current) return e.preventDefault()

		const data = new FormData(rForm.current)
		const answers = data.getAll(INPUT_NAME)

		if (answers.length > max) {
			e.preventDefault()
			toast.error(pluralize`You can only select up to ${max} answer[|s].`)

			return
		}

		submitForm()
	}

	return (
		<form ref={rForm}>
			<ul className="flex flex-col gap-2">
				{props.source.groups.at(0)?.responses.map((response, idx) => {
					return (
						<li key={response}>
							<label className="group flex cursor-pointer select-none items-center gap-2 rounded-lg border border-gray-50 bg-gray-90 py-1.5 pl-[5px] pr-3 has-[:checked]:border-black">
								<div className="flex h-6 w-6 items-center justify-center rounded-[5px] border border-gray-50 bg-white group-has-[:checked]:border-black group-has-[:checked]:bg-black">
									<Text
										style="heading"
										size={18}
										className="uppercase text-gray-50 group-has-[:checked]:text-white"
									>
										{idx + 1}
									</Text>
								</div>

								<Text className="text-gray-50" size={16}>
									{response}
								</Text>

								<input
									type="checkbox"
									name="answer"
									value={response}
									className="appearance-none"
									onClick={handleChange}
									defaultChecked={answer?.responses.includes(response)}
								/>

								<CheckIcon className="ml-auto w-4 opacity-0 group-has-[:checked]:opacity-100" />
							</label>
						</li>
					)
				})}
			</ul>
		</form>
	)
}

type Props = FieldProps<{
	source: FormFieldAnswer
}>

export const NarrowField = ({ source, ...props }: Props) => {
	switch (source.type) {
		case "List":
			return <NarrowListField source={source} {...props} />

		default:
			throw new Error("TODO")
	}
}
