"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type * as ST from "@/sanity/types.gen"
import { SliderPair } from "./SliderPair"
import type { SlidersExercise, SlidersParticipant } from "./types"
import { useMultiplayerSliders } from "./use-multiplayer-sliders"

export type SliderItem = NonNullable<ST.Exercise["sliders"]>[number]

interface Props {
	exercise: SlidersExercise
	participant: SlidersParticipant
	groupSlug?: string
}

export const SlidersClient = ({ exercise, participant, groupSlug }: Props) => {
	if (!exercise.sliders) throw new Error("Invalid Sliders Exercise steps.")

	const router = useRouter()
	const params = useParams()
	const searchParams = useSearchParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1

	const { actions, multiplayer, state } = useMultiplayerSliders({
		exerciseId: exercise._id,
		participantId: participant._id,
		slug: exercise.sliders[stepIdx].slug.current,
		groupSlug,
	})

	const participantOrGroupId = groupSlug ?? participant._id
	const answers = state.participants[participantOrGroupId]
	const role = groupSlug ? state.groups?.[groupSlug]?.[participant._id] : null

	const sliders = exercise.sliders
	const answer = answers?.[exercise.sliders[stepIdx].slug.current]
	const slider = sliders.at(stepIdx)

	if (!multiplayer.synced) return null

	return (
		<div className="mt-8 flex flex-[1_1_0] flex-col gap-6">
			{slider && (
				<SliderPair
					key={slider._key}
					item={slider}
					answer={answer}
					actions={actions}
					readOnly={role ? role !== "captain" : false}
					removeVisuals={exercise.removeSlidersVisual}
				/>
			)}

			<Steps
				steps={exercise.sliders.length - 1}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${params.code}/exercises`)}
				className="mt-auto"
			/>
		</div>
	)
}
