"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./_Quadrant/Quadrant"
import type { Answer } from "./types"

// REVIEW: Instead of exporting this and re-calculating it, I think it would be
// better if <QuadrantSteps /> derived it once and passed the result to the
// other components that need it.
export const getTime = (active: number, index: number) => {
	if (active === index * 2) {
		return "today"
	} else if (active === index * 2 + 1) {
		return "tomorrow"
	}

	// REVIEW: Instead of returning false here, I think it would be better to
	// encode the "idle" state as another literal. That way "getTime()" would
	// always return some result like "idle" | "tomorrow" | "today".
	return false
}

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

	// REVIEW: I think it may be better to keep track of the current step with a
	// search parameter instead of React state, mostly to allow folks to
	// preserve where they are in-case they close the tab or refresh
	// on-accident.
	const [active, setActive] = React.useState(0)

	// REVIEW: Overall, the way that we're tracking the state of this exercise
	// is a little hard to follow. Instead of trying to derive what state we're
	// in based on what `active` is and the `answers` array, I think explicitly
	// tracking the state with a string literal would really clear-up
	// what's going on and when certain elements need to be disabled.
	//
	// For example, if we model the state of the exercise with just string literals:
	//
	// type State = "today_pending" | "today_placed" | "tomorrow_pending" | "tomorrow_placed" | "complete"
	//
	// From that, we can know that `disabled` is true whenever `state` is
	// "today_pending" or "tomorrow_pending".
	const handleDisabled = () => {
		const tomorrow = (active / 2) % 1 > 0 ? true : false

		if (answers.length > 0 && answers.length * 2 === active) {
			return false
		} else if (tomorrow) {
			return !answers[(active - 1) / 2]?.tomorrow?.placed
		} else {
			return !answers[active / 2]?.today?.placed
		}
	}

	return (
		<>
			<div className="mb-10">
				{quadrants.map((quadrant, index) => (
					<div key={quadrant._key}>
						{answers.length > 0 &&
							active === quadrants.length * 2 &&
							index !== 0 && (
								<div className="-ml-7 h-[0.125rem] w-[calc(100%+3.5rem)] bg-gray-90" />
							)}

						{(getTime(active, index) ||
							(answers.length > 0 && active === quadrants.length * 2)) && (
							<Quadrant
								item={quadrant}
								exerciseId={exerciseId}
								isGroup={group}
								index={index}
								active={active}
								answers={answers}
								answer={answers.find((a) => a.name === quadrant.name)}
								todayInstructions={todayInstructions}
								tomorrowInstructions={tomorrowInstructions}
								finalInstructions={finalInstructions}
							/>
						)}
					</div>
				))}
			</div>

			{/* REVIEW: The steps component seems to be pretty involved and needs to
            know a lot about an exercise in order to function. Could <Steps />
            maybe just be a dumber component that just updated a search
            parameter and the exercise itself could keep track of what the
            search parameter is? */}
			<Steps
				disabled={handleDisabled()}
				count={quadrants.length * 2}
				active={active}
				onActiveChange={setActive}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
			/>
		</>
	)
}
