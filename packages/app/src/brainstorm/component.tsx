import { Colors } from "@/colors"
import { PortableText } from "@/components/portable-text"
import { getRouteApi } from "@tanstack/react-router"
import type * as ST from "@unworkshop/studio"
import { Stickies } from "./stickies"
import { useMultiplayerBrainstorm } from "./use-multiplayer-brainstorm"
import React from "react"
import { debounce } from "perfect-debounce"
import * as R from "remeda"

type Props = {
	steps: ST.Brainstorm["steps"]
}

const route = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const BrainstormComponent = (props: Props) => {
	const search = route.useSearch()

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const color = Colors.Variant.parse(stepData.color.label?.toLowerCase())
	const { answer, actions, connecting } = useMultiplayerBrainstorm()

	const answers = answer[search.step] ?? []
	const [optimisticAnswers, setOptimisticAnswers] = React.useOptimistic(answers)

	const onNoteSubmit = (value: string) => {
		actions.submission({ step: search.step, value })
	}

	const throttledEdit = R.funnel(actions.edit, {
		minGapMs: 100,
		triggerAt: "start",
		reducer: (_, args) => args,
	})

	const onNoteChange = (value: string, idx: number) => {
		React.startTransition(async () => {
			setOptimisticAnswers((p) => p.toSpliced(idx, 1, value))
			throttledEdit.call()
		})
	}

	React.useEffect(() => {
		if (connecting) return
		if (answers.length !== 0) return

		actions.submission({ step: search.step, value: "" })
	}, [connecting, answers.length, actions.submission, search.step])

	return (
		<div className="py-3 flex flex-col gap-y-3 grow">
			<div>
				<PortableText value={stepData.prompt} />
				<p className="mt-2 text-neutral-500 text-xs leading-[1.5] font-sans capsize">
					{stepData.helpText}
				</p>
			</div>

			<Stickies.Stack className="mt-auto mb-7.5">
				{optimisticAnswers
					.toReversed()
					.slice(0, 4)
					.map((value, idx) => (
						<Stickies.Note
							color={color}
							key={idx}
							value={value}
							idx={idx}
							onNoteSubmit={onNoteSubmit}
							onNoteChange={(value) => onNoteChange(value, idx)}
							placeholder={stepData.placeholder}
						/>
					))}
			</Stickies.Stack>
		</div>
	)
}
