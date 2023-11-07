"use client"

import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Steps } from "@/components/Steps"
import type { ST } from "@/sanity/config"
import { Quadrant } from "./Quadrant"

export const getTime = (active: number, index: number) => {
	if (active === index * 2) {
		return "today"
	} else if (active === index * 2 + 1) {
		return "tomorrow"
	}

	return false
}

type QuadrantsExerciseProps = {
	quadrants: ST["exercise"]["quadrants"]
}

export const QuadrantsExercise = ({ quadrants }: QuadrantsExerciseProps) => {
	const [results, setResults] = useState(
		quadrants?.map(() => ({
			today: { top: 0, left: 0, placed: false },
			tomorrow: { top: 0, left: 0, placed: false },
			arrow: { top: 0, left: 0, width: 0, angle: 0 },
		})),
	)
	const [active, setActive] = useState(0)
	if (!quadrants) return null

	const handleDisabled = () => {
		const tomorrow = (active / 2) % 1 > 0 ? true : false

		if (tomorrow) {
			return !results[(active - 1) / 2]?.tomorrow?.placed
		} else if (active !== results.length * 2) {
			return !results[active / 2]?.today?.placed
		}

		return false
	}

	return (
		<div className="mt-8">
			<DndProvider backend={HTML5Backend}>
				{quadrants.map((quadrant, index) => (
					<div key={index}>
						{(getTime(active, index) === "today" ||
							getTime(active, index) === "tomorrow" ||
							active === results.length * 2) && (
							<Quadrant
								item={quadrant}
								index={index}
								active={active}
								results={results}
								setResults={setResults}
							/>
						)}
					</div>
				))}

				<Steps
					disabled={handleDisabled()}
					count={quadrants.length * 2}
					active={active}
					onActiveChange={setActive}
					onFinish={() => alert("done")}
				/>
			</DndProvider>
		</div>
	)
}
