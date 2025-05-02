import { Colors } from "@/colors"
import { PortableText } from "@/components/portable-text"
import { getRouteApi } from "@tanstack/react-router"
import type * as ST from "@unworkshop/studio"
import { Stickies } from "./stickies"
import React from "react"

type Props = {
	steps: ST.Brainstorm["steps"]
}

const route = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const BrainstormComponent = (props: Props) => {
	const search = route.useSearch()
	const [answers, setAnswers] = React.useState([1, 2])

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const color = Colors.Variant.parse(stepData.color.label?.toLowerCase())

	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const addNew = () => setAnswers((p) => [...p, p.at(-1)! + 1])

	return (
		<div className="py-3 flex flex-col gap-y-3 grow">
			<div>
				<PortableText value={stepData.prompt} />
				<p className="mt-2 text-neutral-500 text-xs leading-[1.5] font-sans capsize">
					{stepData.helpText}
				</p>
			</div>

			<Stickies.Stack className="mt-auto mb-7.5">
				{answers
					.toReversed()
					.slice(0, 5)
					.map((a, idx) => (
						<Stickies.Note color={color} key={a} idx={idx} addNew={addNew} />
					))}
			</Stickies.Stack>
		</div>
	)
}
