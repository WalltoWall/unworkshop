import { getRouteApi } from "@tanstack/react-router"
import type * as ST from "@unworkshop/studio"
import { ExpandIcon, PlusIcon } from "lucide-react"
import React from "react"
import { Colors } from "@/colors"
import { Button } from "@/components/Button"
import { PortableText } from "@/components/portable-text"
import { useTinykeys } from "@/lib/use-tinykeys"
import { Stickies } from "./stickies"
import { useMultiplayerBrainstorm } from "./use-multiplayer-brainstorm"

type Props = {
	steps: ST.Brainstorm["steps"]
}

const route = getRouteApi("/kickoff/$code_/$exerciseSlug")

export const BrainstormComponent = (props: Props) => {
	const search = route.useSearch()
	const expanded = Stickies.useExpanded()
	const { answer, actions, connecting } = useMultiplayerBrainstorm()

	useTinykeys({ "$mod+Enter": () => actions.add({ step: search.step }) })

	const stepData = props.steps.at(search.step - 1)
	if (!stepData) throw new Error("Something went wrong.")

	const color = Colors.Variant.parse(stepData.color.label?.toLowerCase())
	const answers = answer?.[search.step] ?? []

	React.useEffect(() => {
		if (connecting || answers.length !== 0) return

		actions.add({ step: search.step })
	}, [connecting, answers.length, actions.add, search.step])

	const visibleAnswers = expanded
		? answers.toReversed()
		: answers.toReversed().slice(0, 5)

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
							onNoteChange={(value) =>
								actions.edit({ id: s.id, step: search.step, value })
							}
							onNoteDelete={() =>
								actions.delete({ id: s.id, step: search.step })
							}
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
						onClick={() => actions.add({ step: search.step })}
					>
						<span className="sr-only">Submit sticky</span>
						<PlusIcon className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
