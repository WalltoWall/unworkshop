"use client"

import React from "react"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./Quadrant"
import type { Answer } from "./types"

export const getTime = (active: number, index: number) => {
	if (active === index * 2) {
		return "today"
	} else if (active === index * 2 + 1) {
		return "tomorrow"
	}

	return false
}

type QuadrantStepsProps = {
	answers: Answer[]
	exerciseId: string
	quadrants: ST["exercise"]["quadrants"]
	group: boolean
	todayInstructions: ST["exercise"]["today_instructions"]
	tomorrowInstructions: ST["exercise"]["tomorrow_instructions"]
	finalInstructions: ST["exercise"]["finalize_instructions"]
}

export const QuadrantSteps = ({
	answers,
	exerciseId,
	quadrants,
	group,
	todayInstructions,
	tomorrowInstructions,
	finalInstructions,
}: QuadrantStepsProps) => {
	// const [optimisticAnswers, addOptimisticAnswer] = React.useOptimistic<
	// 	Answer[],
	// 	Answer
	// >(answers, (state, newAnswer) => {
	// 	const existingIndex = state.findIndex((a) => a.id === newAnswer.id)

	// 	console.log(existingIndex)
	// 	return [...state]
	// })
	const [results, setResults] = React.useState<Answer[]>(answers)
	const [active, setActive] = React.useState(0)

	return (
		<>
			{quadrants?.map((quadrant, index) => (
				<div key={quadrant._key}>
					{(getTime(active, index) === "today" ||
						getTime(active, index) === "tomorrow" ||
						(answers.length > 0 && active === answers.length * 2)) && (
						<Quadrant
							item={quadrant}
							exerciseId={exerciseId}
							index={index}
							active={active}
							isGroup={group}
							results={results}
							setResults={setResults}
							todayInstructions={todayInstructions}
							tomorrowInstructions={tomorrowInstructions}
							finalInstructions={finalInstructions}
						/>
					)}
				</div>
			))}

			<Steps
				disabled={false}
				count={quadrants!.length * 2}
				active={active}
				onActiveChange={setActive}
				onFinish={() => alert("done")}
			/>
		</>
	)
}
