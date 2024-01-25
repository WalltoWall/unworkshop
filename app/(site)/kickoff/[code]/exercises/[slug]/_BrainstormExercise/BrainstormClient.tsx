"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import * as R from "remeda"
import { uid } from "uid"
import * as Y from "yjs"
import {
	useMultiplayer,
	type MultiplayerArgs,
} from "@/components/Multiplayer/use-multiplayer"
import { Steps } from "@/components/Steps"
import { useForceUpdate } from "@/lib/use-force-update"
import type { ST } from "@/sanity/config"
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
	const forceUpdate = useForceUpdate()
	const multiplayer = useMultiplayer(args)
	const yMap = React.useRef(multiplayer.doc.getMap("answers")).current

	React.useEffect(() => {
		const onChange = () => forceUpdate()

		multiplayer.doc.on("update", onChange)

		return () => multiplayer.doc.off("update", onChange)
	}, [multiplayer.doc, forceUpdate])

	const getYParticipant = () => {
		const ySteps = yMap.get("steps") as Y.Array<Y.Map<any>>
		const yStep = ySteps.get(stepIdx)
		const yParticipants = yStep.get("participants") as Y.Map<any>

		const yParticipant = yParticipants.has(participantId)
			? (yParticipants.get(participantId) as Y.Map<any>)
			: yParticipants.set(participantId, new Y.Map<any>())

		return yParticipant
	}

	const getYUnsorted = (yParticipant: Y.Map<any>) => {
		const yUnsorted = yParticipant.has("unsorted")
			? (yParticipant.get("unsorted") as Y.Array<Y.Map<any>>)
			: yParticipant.set("unsorted", new Y.Array<Y.Map<any>>())

		return yUnsorted
	}

	const getYColumns = (yParticipant: Y.Map<any>) => {
		const yColumns = yParticipant.has("columns")
			? (yParticipant.get("columns") as Y.Array<Y.Map<any>>)
			: yParticipant.set("columns", new Y.Array<Y.Map<any>>())

		return yColumns
	}

	const actions: BrainstormCardActions = {
		addCard: (response) => {
			const yParticipant = getYParticipant()
			const yUnsorted = getYUnsorted(yParticipant)

			const yCard = new Y.Map()
			yCard.set("id", uid())
			yCard.set("response", new Y.Text(response))
			yCard.set("createdAt", new Date().toString())

			yUnsorted.push([yCard])
		},

		editCard: (id, response) => {
			const yParticipant = getYParticipant()
			const yUnsorted = getYUnsorted(yParticipant)
			const yColumns = getYColumns(yParticipant)

			const assignCardIfFound = (yCard: Y.Map<any>) => {
				if (yCard.get("id") !== id) return

				yCard.set("response", response)
			}

			yUnsorted.forEach(assignCardIfFound)
			yColumns.forEach((yColumn) => {
				const yCards = yColumn.get("cards") as Y.Array<Y.Map<any>>
				yCards.forEach(assignCardIfFound)
			})
		},

		deleteCard: (id) => {
			const yParticipant = getYParticipant()
			const yUnsorted = getYUnsorted(yParticipant)
			const yColumns = getYColumns(yParticipant)

			yUnsorted.forEach((yCard, idx) => {
				if (yCard.get("id") !== id) return

				yUnsorted.delete(idx)
			})

			yColumns.forEach((yColumn) => {
				const yCards = yColumn.get("cards") as Y.Array<Y.Map<any>>
				yCards.forEach((yCard, idx) => {
					if (yCard.get("id") !== id) return

					yColumns.delete(idx)
				})
			})
		},
	}

	return { data: yMap.toJSON() as BrainstormAnswers, multiplayer, actions }
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
