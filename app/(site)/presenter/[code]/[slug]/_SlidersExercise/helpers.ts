import type { Answer as QuadrantAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

type GraphValuesProps = {
	answers: Array<Answer>
}

function evenlyDistributeNumbers(start: number, end: number, count: number) {
	if (count <= 0) {
		console.error("Count must be greater than 0")
		return []
	}

	const step = (end - start) / (count - 1)
	const result = []

	for (let i = 0; i < count; i++) {
		const value = start + i * step
		result.push(value)
	}

	return result
}

function getLeftValue(leftValue: number) {
	switch (leftValue) {
		case 1: {
			return 1
		}
		case 2: {
			return 20.6
		}
		case 3: {
			return 40.3
		}
		case 4: {
			return 60
		}
		case 5: {
			return 80
		}
		case 6: {
			return 100
		}
		default: {
			return 1
		}
	}
}

export const getGraphValues = ({ answers }: GraphValuesProps) => {
	const topValues = evenlyDistributeNumbers(15, 55, answers.length)

	const graphAnswers: Array<QuadrantAnswer> = answers.map((answer, idx) => {
		const topVal = topValues[idx]

		return {
			today: {
				left: getLeftValue(answer.today!),
				top: topVal,
			},
			tomorrow: {
				left: getLeftValue(answer.tomorrow!),
				top: topVal,
			},
		}
	})

	return graphAnswers
}
