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
}

const BrainstormClient = ({ exercise, participant }: Props) => {
	if (!exercise.steps) throw new Error("Invalid brainstorm Exercise steps.")

	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1
	const stepData = exercise.steps.at(stepIdx)

	const { snap, actions } = useMultiplayerBrainstorm({
		exerciseId: exercise._id,
		stepIdx,
	})

	const unsorted =
		snap.steps?.at(stepIdx)?.participants?.[participant._id]?.unsorted ?? []
	const sorted =
		snap.steps
			?.at(stepIdx)
			?.participants?.[participant._id]?.columns?.flatMap((c) => c.cards) ?? []

	const cards = R.sortBy(unsorted.concat(sorted), [(c) => c.createdAt, "desc"])

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
				participantId={participant._id}
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
