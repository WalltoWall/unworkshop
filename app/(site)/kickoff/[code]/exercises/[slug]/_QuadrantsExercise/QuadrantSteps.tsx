"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./_Quadrant/Quadrant"
import { QuadrantInstructions } from "./QuadrantInstructions"
import type { Answer } from "./types"

export type AnswerDispatch = {
	newAnswer: Answer
	name: string
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
	const step = parseInt(searchParams?.get("step") ?? "1")

	const [optimisticAnswers, answerDispatch] = React.useOptimistic<
		Array<Answer>,
		AnswerDispatch
	>(answers, (state, action) => {
		return {
			...state,
			[action.name]: action.newAnswer,
		}
	})

	const [state, setState] = useState<State>("today_pending")
	const totalSteps = quadrants.length * 2
	const isDisabled = state === "today_pending" || state === "tomorrow_pending"

	// TODO: Comment why passing step explicitly is required here.
	const determineNextState = (step: number) => {
		// We are on the last quadrant, so we need to mark this is as complete.
		if (step - 1 === totalSteps) {
			return setState("complete")
		}

		// Otherwise, we can know the next state based on the current.
		if (state === "today_pending") {
			setState("today_placed")
		} else if (state === "today_placed") {
			setState("tomorrow_pending")
		} else if (state === "tomorrow_pending") {
			setState("tomorrow_placed")
		} else if (state === "tomorrow_placed") {
			setState("today_pending")
		}
	}

	const handleClick = () => {
		switch (state) {
			case "today_pending":
				return determineNextState(step)

			case "tomorrow_pending":
				return determineNextState(step)

			default:
				return
		}
	}

	const currentQuadrantIdx = Math.ceil(step / 2) - 1
	const currentQuadrant = quadrants.at(currentQuadrantIdx)!

	return (
		<>
			<div className="mb-10">
				<QuadrantInstructions
					state={state}
					todayInstructions={todayInstructions}
					tomorrowInstructions={tomorrowInstructions}
					finalInstructions={finalInstructions}
				/>

				{state === "complete" ? (
					quadrants.map((quadrant, index) => (
						<div key={quadrant._key}>
							<div className="-ml-7 h-[0.125rem] w-[calc(100%+3.5rem)] bg-gray-90" />

							<Quadrant
								item={quadrant}
								exerciseId={exerciseId}
								isGroup={group}
								answer={optimisticAnswers.find((a) => a.name === quadrant.name)}
								state={state}
								index={index}
								answerDispatch={answerDispatch}
								onQuadrantClick={handleClick}
							/>
						</div>
					))
				) : (
					<div key={currentQuadrant?._key}>
						<Quadrant
							item={currentQuadrant}
							exerciseId={exerciseId}
							isGroup={group}
							answer={optimisticAnswers.find(
								(a) => a.name === currentQuadrant.name,
							)}
							index={currentQuadrantIdx}
							state={state}
							answerDispatch={answerDispatch}
							onQuadrantClick={handleClick}
						/>
					</div>
				)}
			</div>

			{state}

			<Steps
				disabled={isDisabled}
				steps={totalSteps}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
				onNextStep={determineNextState}
			/>
		</>
	)
}
