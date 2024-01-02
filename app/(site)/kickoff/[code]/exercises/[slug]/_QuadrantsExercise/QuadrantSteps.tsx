"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./_Quadrant/Quadrant"
import { QuadrantInstructions } from "./QuadrantInstructions"
import type { Answer } from "./types"

export type AnswerDispatch = {
	payload: Answer
}

export type State =
	| "today_pending"
	| "today_placed"
	| "tomorrow_pending"
	| "tomorrow_placed"
	| "complete"

type QuadrantStepsProps = {
	answers: Answer[]
	exerciseId: string
	quadrants: NonNullable<ST["exercise"]["quadrants"]>
	group: boolean
	todayInstructions: ST["exercise"]["today_instructions"]
	tomorrowInstructions: ST["exercise"]["tomorrow_instructions"]
	finalInstructions: ST["exercise"]["finalize_instructions"]
	kickoffCode: string
}

export const QuadrantSteps = ({
	answers,
	exerciseId,
	quadrants,
	group,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
	kickoffCode,
}: QuadrantStepsProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	let step = parseInt(searchParams?.get("step") ?? "1")

	const [optimisticAnswers, answerDispatch] = React.useOptimistic<
		Array<Answer>,
		AnswerDispatch
	>(answers, (state, action) => {
		return [...state, action.payload]
	})

	const [state, setState] = useState<State>("today_pending")

	useEffect(() => {
		const answerIndex = Math.ceil(step / 2) - 1

		if (step - 1 === quadrants.length * 2) {
			setState("complete")
		} else if (step & 1) {
			setState(
				optimisticAnswers?.at(answerIndex)?.today?.placed
					? "today_placed"
					: "today_pending",
			)
		} else {
			setState(
				optimisticAnswers?.at(answerIndex)?.tomorrow?.placed
					? "tomorrow_placed"
					: "tomorrow_pending",
			)
		}
	}, [step, optimisticAnswers, quadrants])

	const handleDisabled = () => {
		return state === "today_pending" || state === "tomorrow_pending"
	}

	return (
		<>
			<div className="mb-10">
				<QuadrantInstructions
					state={state}
					todayInstructions={todayInstructions}
					tomorrowInstructions={tomorrowInstructions}
					finalInstructions={finalInstructions}
				/>

				{quadrants.map((quadrant, index) => (
					<div key={quadrant._key}>
						{index !== 0 && state === "complete" && (
							<div className="-ml-7 h-[0.125rem] w-[calc(100%+3.5rem)] bg-gray-90" />
						)}

						{(Math.ceil(step / 2) - 1 === index || state === "complete") && (
							<Quadrant
								item={quadrant}
								exerciseId={exerciseId}
								isGroup={group}
								answer={optimisticAnswers?.at(index)}
								index={index}
								state={state}
								answerDispatch={answerDispatch}
							/>
						)}
					</div>
				))}
			</div>

			{state}

			<Steps
				disabled={handleDisabled()}
				steps={quadrants.length * 2}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
			/>
		</>
	)
}
