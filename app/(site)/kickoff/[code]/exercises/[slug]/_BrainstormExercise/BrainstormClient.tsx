"use client"

import React from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
	participantId,
	stepIdx,
	...args
}: MultiplayerArgs & {
	participantId: string
	totalSteps: number
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

	const actions: BrainstormCardActions = {
		addCard: (response) => {
			const ySteps = yMap.get("steps") as Y.Array<Y.Map<any>>
			const yStep = ySteps.get(stepIdx)
			const yUnsorted = yStep.get("unsorted") as Y.Array<Y.Map<any>>

			const yCard = new Y.Map()
			yCard.set("id", uid())
			yCard.set("response", new Y.Text(response))
			yCard.set("participantId", participantId)

			yUnsorted.push([yCard])
		},
		editCard: (id, response) => {
			const ySteps = yMap.get("steps") as Y.Array<Y.Map<any>>
			const yStep = ySteps.get(stepIdx)

			const yUnsorted = yStep.get("unsorted") as Y.Array<Y.Map<any>>
			const ySorted = yStep.get("sorted") as Y.Array<Y.Map<any>>

			const assignCardIfFound = (yCard: Y.Map<any>) => {
				if (yCard.get("id") !== id) return

				yCard.set("response", response)
			}

			yUnsorted.forEach(assignCardIfFound)
			ySorted.forEach((yColumn) => {
				const yCards = yColumn.get("cards") as Y.Array<Y.Map<any>>
				yCards.forEach(assignCardIfFound)
			})
		},
		deleteCard: (id) => {
			const ySteps = yMap.get("steps") as Y.Array<Y.Map<any>>
			const yStep = ySteps.get(stepIdx)

			const yUnsorted = yStep.get("unsorted") as Y.Array<Y.Map<any>>
			const ySorted = yStep.get("sorted") as Y.Array<Y.Map<any>>

			yUnsorted.forEach((yCard, idx) => {
				if (yCard.get("id") !== id) return

				yUnsorted.delete(idx)
			})

			ySorted.forEach((yColumn) => {
				const yCards = yColumn.get("cards") as Y.Array<Y.Map<any>>
				yCards.forEach((yCard, idx) => {
					if (yCard.get("id") !== id) return

					ySorted.delete(idx)
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

	const brainstorm = useMultiplayerBrainstorm({
		exerciseId: exercise._id,
		participantId: participant._id,
		totalSteps: exercise.steps.length,
		stepIdx,
	})

	const cards = brainstorm.data.steps?.at(stepIdx)?.unsorted ?? []

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
				actions={brainstorm.actions}
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
