"use client"

import React from "react"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./_Quadrant/Quadrant"
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
	quadrants: NonNullable<ST["exercise"]["quadrants"]>
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
	const [active, setActive] = React.useState(0)

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

			<Steps
				disabled={handleDisabled()}
				count={quadrants.length * 2}
				active={active}
				onActiveChange={setActive}
				onFinish={() => alert("done")}
			/>
		</>
	)
}
