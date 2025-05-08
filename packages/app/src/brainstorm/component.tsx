import { Colors } from "@/colors"
import { PortableText } from "@/components/portable-text"
import { getRouteApi } from "@tanstack/react-router"
import type * as ST from "@unworkshop/studio"
import { Stickies } from "./stickies"
import { useMultiplayerBrainstorm } from "./use-multiplayer-brainstorm"
import React from "react"
import { debounce } from "perfect-debounce"
import { nanoid } from "nanoid"
import { Button } from "@/components/Button"
import { ExpandIcon, PlusIcon } from "lucide-react"
import { useTinykeys } from "@/lib/use-tinykeys"

type Props = {
	steps: ST.Brainstorm["steps"]
}

const route = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const BrainstormComponent = (props: Props) => {
	const search = route.useSearch()
	const expanded = Stickies.useExpanded()
	const { answer, actions, connecting } = useMultiplayerBrainstorm()

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const color = Colors.Variant.parse(stepData.color.label?.toLowerCase())

	const answers = answer[search.step] ?? []
	const [optimisticAnswers, setOptimisticAnswers] = React.useOptimistic(answers)

	useTinykeys({ "$mod+Enter": addNewNote })

	const submissionDisabled = optimisticAnswers.at(-1)?.value.length === 0

	function addNewNote() {
		if (submissionDisabled) return

		React.startTransition(async () => {
			setOptimisticAnswers((p) => [...p, { id: nanoid(6), value: "" }])
			await actions.add({ step: search.step })
		})
	}

	const editNote = debounce(actions.edit, 150)

	function updateNote(value: string, stickyId: string) {
		React.startTransition(async () => {
			const idx = optimisticAnswers.findIndex((s) => s.id === stickyId)
			const sticky = optimisticAnswers.at(idx)
			if (idx === -1 || !sticky) return

			setOptimisticAnswers((p) => p.toSpliced(idx, 1, { id: sticky.id, value }))
			await editNote({ step: search.step, value, idx })
		})
	}

	function deleteNote(stickyId: string) {
		React.startTransition(async () => {
			const idx = optimisticAnswers.findIndex((s) => s.id === stickyId)
			const sticky = optimisticAnswers.at(idx)
			if (idx === -1 || !sticky) return

			const confirmed = confirm(
				`Are you sure you wanted to delete: "${sticky.value}"?`,
			)
			if (!confirmed) return

			setOptimisticAnswers((p) => p.toSpliced(idx, 1))
			await actions.delete({ step: search.step, idx })
		})
	}

	React.useEffect(() => {
		if (connecting) return
		if (answers.length !== 0) return

		actions.add({ step: search.step })
	}, [connecting, answers.length, actions.add, search.step])

	const visibleAnswers = expanded
		? optimisticAnswers.toReversed()
		: optimisticAnswers.toReversed().slice(0, 5)

	return (
		<div className="py-3 flex flex-col gap-y-3 grow">
			<div>
				<PortableText value={stepData.prompt} />
				<p className="mt-2 text-neutral-500 text-xs leading-[1.5] font-sans capsize">
					{stepData.helpText}
				</p>
			</div>

			<div className="relative mt-auto mb-7.5">
				<Stickies.Stack>
					{visibleAnswers.map((s, idx) => (
						<Stickies.Note
							color={color}
							key={s.id}
							value={s.value}
							idx={idx}
							onNoteChange={(v) => updateNote(v, s.id)}
							onNoteDelete={() => deleteNote(s.id)}
							placeholder={stepData.placeholder}
						/>
					))}
				</Stickies.Stack>

				<div className="absolute bottom-3 right-3 flex gap-2">
					<Button
						className="rounded-full text-white"
						size="icon"
						onClick={Stickies.expand}
					>
						<span className="sr-only">See all stickies</span>
						<ExpandIcon className="size-4" />
					</Button>

					<Button
						className="rounded-full text-white"
						size="icon"
						onClick={addNewNote}
						disabled={submissionDisabled}
					>
						<span className="sr-only">Submit sticky</span>
						<PlusIcon className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
