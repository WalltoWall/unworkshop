"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import * as R from "remeda"
import { Steps } from "@/components/Steps"
import { CardScroller } from "./CardScroller"
import { type BrainstormExercise, type BrainstormParticipant } from "./types"
import { useMultiplayerBrainstorm } from "./use-multiplayer-brainstorm"

type Props = {
	exercise: BrainstormExercise
	participant: BrainstormParticipant
	groupSlug?: string
}

const BrainstormClient = ({ exercise, participant, groupSlug }: Props) => {
	if (!exercise.steps) throw new Error("Invalid brainstorm Exercise steps.")

	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1
	const stepData = exercise.steps.at(stepIdx)

	const { snap, actions, multiplayer } = useMultiplayerBrainstorm({
		exerciseId: exercise._id,
		stepIdx,
	})
	const unsorted = snap.steps.at(stepIdx)?.unsorted ?? []
	const columns = snap.steps.at(stepIdx)?.columns ?? []

	const sorted = columns.flatMap((c) => c.cards)

	const cards = R.pipe(
		unsorted.concat(sorted),
		R.sortBy([(c) => c.createdAt, "desc"]),
		R.filter((c) => c.participantOrGroupId === (groupSlug ?? participant._id)),
	)

	const role = groupSlug && snap.groups?.[groupSlug]?.[participant._id]

	return (
		<div className="flex flex-[1_1_0] flex-col">
			{stepData && (
				<div className="mt-1">
					<h4 className="max-w-[16rem] text-16 leading-[1.4] font-sans capsize">
						{stepData.prompt}
					</h4>

					<p className="mt-5 text-gray-50 text-12 leading-[1.5] font-sans capsize">
						{stepData.helpText}
					</p>
				</div>
			)}

			<CardScroller
				cards={cards}
				color={stepData?.color}
				actions={actions}
				participantOrGroupId={groupSlug ?? participant._id}
				readOnly={role === "contributor"}
				placeholder={stepData?.placeholder}
				synced={multiplayer.provider.synced}
			/>

			<Steps
				steps={exercise.steps.length - 1}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${params.code}/exercises`)}
			/>
		</div>
	)
}

export default BrainstormClient
