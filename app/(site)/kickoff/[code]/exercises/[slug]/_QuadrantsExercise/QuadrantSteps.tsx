"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { useCaptainAnswers } from "@/sanity/groups"
import type { GroupAnswer, IndividualAnswer } from "../groups/types"
import { Quadrant } from "./_Quadrant/Quadrant"
import { QuadrantInstructions } from "./QuadrantInstructions"
import type { Answer, Answers } from "./types"

export type AnswerDispatch = {
	newAnswer: Answer
	slug: string
}

export type State =
	| "today_pending"
	| "today_placed"
	| "tomorrow_pending"
	| "tomorrow_placed"
	| "complete"

type QuadrantStepsProps = {
	answers: Answers
	exerciseId: string
	quadrants: NonNullable<ST["exercise"]["quadrants"]>
	meta?: IndividualAnswer | GroupAnswer
	todayInstructions: ST["exercise"]["today_instructions"]
	tomorrowInstructions: ST["exercise"]["tomorrow_instructions"]
	finalInstructions: ST["exercise"]["finalize_instructions"]
	kickoffCode: string
	readOnly: boolean
}

export const QuadrantSteps = ({
	answers,
	exerciseId,
	quadrants,
	meta,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
	kickoffCode,
	readOnly,
}: QuadrantStepsProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const totalSteps = quadrants.length * 2

	const groupCaptainAnswers = useCaptainAnswers(exerciseId, meta?.group) ?? {}

	const [optimisticAnswers, answerDispatch] = React.useOptimistic<
		Answers,
		AnswerDispatch
	>(answers, (state, action) => {
		const newPositions = ({ ...answers[action.slug] } || {}) as Answer

		if (action.newAnswer.today) {
			newPositions.today = action.newAnswer.today
		}

		if (action.newAnswer.tomorrow) {
			newPositions.tomorrow = action.newAnswer.tomorrow
		}

		return {
			...state,
			[action.slug]: newPositions,
		}
	})

	// step is passed explicitely here since this fires before url params have been updated
	const determineNextState = (step: number) => {
		// We are on the last quadrant, so we need to mark this is as complete.
		if (step - 1 === totalSteps) {
			return "complete"
		}

		const selectingForToday = step & 1
		const currentQuadrantIdx = Math.ceil(step / 2) - 1
		const currentQuadrant = quadrants.at(currentQuadrantIdx)!

		if (selectingForToday) {
			return answers[currentQuadrant.slug.current]?.today
				? "today_placed"
				: "today_pending"
		} else {
			return answers[currentQuadrant.slug.current]?.tomorrow
				? "tomorrow_placed"
				: "tomorrow_pending"
		}
	}

	const [state, setState] = useState<State>(determineNextState(step))
	const isDisabled =
		(state === "today_pending" || state === "tomorrow_pending") &&
		meta?.role !== "contributor"
	const currentQuadrantIdx = Math.ceil(step / 2) - 1
	const currentQuadrant = quadrants.at(currentQuadrantIdx)

	const onStepChange = (step: number) => {
		setState(determineNextState(step))
	}

	const handleClick = () => {
		switch (state) {
			case "today_pending":
				setState("today_placed")
				break

			case "tomorrow_pending":
				setState("tomorrow_placed")
				break
		}
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

				{state === "complete" ? (
					quadrants.map((quadrant, index) => (
						<div key={quadrant._key}>
							{index !== 0 && (
								<div className="-ml-7 h-[0.125rem] w-[calc(100%+3.5rem)] bg-gray-90" />
							)}

							<Quadrant
								item={quadrant}
								exerciseId={exerciseId}
								group={meta}
								captainAnswer={groupCaptainAnswers[quadrant.slug.current]}
								answer={optimisticAnswers[quadrant.slug.current]}
								state={state}
								index={index}
								answerDispatch={answerDispatch}
								onQuadrantClick={handleClick}
								readOnly={readOnly}
							/>
						</div>
					))
				) : currentQuadrant ? (
					<div key={currentQuadrant?._key}>
						<Quadrant
							item={currentQuadrant}
							exerciseId={exerciseId}
							group={meta}
							captainAnswer={groupCaptainAnswers[currentQuadrant.slug.current]}
							answer={optimisticAnswers[currentQuadrant.slug.current]}
							index={currentQuadrantIdx}
							state={state}
							answerDispatch={answerDispatch}
							onQuadrantClick={handleClick}
							readOnly={readOnly}
						/>
					</div>
				) : null}
			</div>

			<Steps
				disabled={isDisabled}
				steps={totalSteps}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
				onNextStep={onStepChange}
			/>
		</>
	)
}
