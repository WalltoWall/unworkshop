"use client"

import { useSearchParams } from "next/navigation"
import { PortableText } from "@/components/portable-text"
import { useStep } from "@/lib/use-step"
import { Participant } from "@/participant"
import type * as ST from "@/sanity/types.gen"

type Props = {
	steps: ST.Sliders["steps"]
}

export const SlidersComponent = (props: Props) => {
	const participant = Participant.useInfo()
	const [step] = useStep()
	console.log(participant)

	const data = props.steps.at(step - 1)
	if (!data) throw new Error("Something went wrong.")

	return (
		<div>
			<PortableText value={data.prompt} />
		</div>
	)
}
