"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import * as R from "remeda"
import { uid } from "uid"
import { proxy, useSnapshot } from "valtio"
import { bind } from "valtio-yjs"
import * as Y from "yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { ANSWERS_KEY } from "@/constants"
import { CardScroller } from "./CardScroller"
import {
	type BrainstormAnswers,
	type BrainstormCardActions,
	type BrainstormParticipant,
} from "./types"

type BrainstormClientProps = {
	exercise: ST["exercise"]
	participant: BrainstormParticipant
}

const useMultiplayerBrainstorm = ({
	stepIdx,
	participantId,
	...args
}: MultiplayerArgs & {
	totalSteps: number
	participantId: string
	stepIdx: number
}) => {
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap(ANSWERS_KEY)).current
	const state = React.useRef(
		proxy<BrainstormAnswers>({
			steps: [{ participants: {}, groups: {} }],
		}),
	).current
	const snap = useSnapshot(state)

	// eslint-disable-next-line react-hooks/exhaustive-deps
	React.useEffect(() => bind(state, yMap), [])

	const getParticipant = () => {
		state.steps[stepIdx] ??= { groups: {}, participants: {} }

		const step = state.steps[stepIdx]
		const participants = step.participants

		participants[participantId] ??= { unsorted: [], columns: [] }
		const participant = participants[participantId]

		return participant
	}

	const actions: BrainstormCardActions = {
		addCard: (response) => {
			const participant = getParticipant()

			participant.unsorted.push({
				id: uid(),
				response,
				createdAt: Math.floor(new Date().getTime() / 1000),
			})
		},

		editCard: (id, response) => {
			const participant = getParticipant()

			const card =
				participant.unsorted.find((c) => c.id === id) ||
				participant.columns.flatMap((col) => col.cards).find((c) => c.id === id)
			if (!card) return

			card.response = response
		},

		deleteCard: (id) => {
			const participant = getParticipant()

			const unsortedIdx = participant.unsorted.findIndex((c) => c.id === id)
			if (unsortedIdx >= 0) {
				participant.unsorted.splice(unsortedIdx, 1)

				return
			}

			const col = participant.columns.find((col) =>
				col.cards.some((card) => card.id === id),
			)
			if (!col) return

			const sortedIdx = col.cards.findIndex((card) => card.id === id)
			if (sortedIdx >= 0) {
				col.cards.splice(sortedIdx, 1)
			}
		},
	}

	return { data: snap, multiplayer, actions }
}

const BrainstormClient = ({ exercise, participant }: BrainstormClientProps) => {
	if (!exercise.steps) throw new Error("Invalid brainstorm Exercise steps.")

	const router = useRouter()
	const searchParams = useSearchParams()
	const params = useParams()

	const step = parseInt(searchParams?.get("step") ?? "1")
	const stepIdx = step - 1
	const stepData = exercise.steps.at(stepIdx)

	const { data, actions } = useMultiplayerBrainstorm({
		exerciseId: exercise._id,
		totalSteps: exercise.steps.length,
		participantId: participant._id,
		stepIdx,
	})

	console.log(data)

	const unsorted =
		data.steps?.at(stepIdx)?.participants?.[participant._id]?.unsorted ?? []
	const sorted =
		data.steps
			?.at(stepIdx)
			?.participants?.[participant._id]?.columns?.flatMap((c) => c.cards) ?? []

	const cards = R.sortBy(unsorted.concat(sorted), (c) => c.createdAt)

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

			<CardScroller cards={cards} color={stepData?.color} actions={actions} />

			<Steps
				steps={exercise.steps.length - 1}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${params.code}/exercises`)}
			/>
		</div>
	)
}

export default BrainstormClient
