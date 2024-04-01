import type { Answer as QuadrantAnswer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import type { Answer } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"

type GraphValuesProps = {
	answers: Array<Answer>
}

function sortByXValue(answers: Array<Answer>) {
	const group1: Answer[] = []
	const group2: Answer[] = []
	const group3: Answer[] = []
	const group4: Answer[] = []
	const group5: Answer[] = []
	const group6: Answer[] = []

	answers.map((answer) => {
		if (answer.today === 1) {
			group1.push(answer)
		} else if (answer.today === 2) {
			group2.push(answer)
		} else if (answer.today === 3) {
			group3.push(answer)
		} else if (answer.today === 4) {
			group4.push(answer)
		} else if (answer.today === 5) {
			group5.push(answer)
		} else {
			group6.push(answer)
		}
	})

	return {
		group1,
		group2,
		group3,
		group4,
		group5,
		group6,
	}
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

function getLeftValue(leftValue: number, isTomorrow?: boolean) {
	if (isTomorrow) {
		switch (leftValue) {
			case 1: {
				return 3
			}
			case 2: {
				return 23
			}
			case 3: {
				return 43
			}
			case 4: {
				return 63
			}
			case 5: {
				return 83
			}
			case 6: {
				return 98
			}
			default: {
				return 1
			}
		}
	}
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
	const topValues = evenlyDistributeNumbers(14, 59, answers.length)

	const graphAnswers: Array<QuadrantAnswer> = answers.map((answer, idx) => {
		const topVal = topValues[idx]

		return {
			today: {
				left: getLeftValue(answer.today!),
				top: topVal,
			},
			tomorrow: {
				left: getLeftValue(answer.tomorrow!, true),
				top: topVal,
			},
		}
	})

	return graphAnswers
}

// const sortedAnswersByXValue = sortByXValue(answers)

// 	const graphAnswers:
// 		| QuadrantAnswer[]
// 		| {
// 				today: { left: number; top: number }
// 				tomorrow: { left: number; top: number }
// 		  }[][] = []

// 	Object.entries(sortedAnswersByXValue).forEach((value) => {
// 		graphAnswers.push(
// 			value[1].map((answer, idx) => {
// 				const topVal = topValues[idx]

// 				return {
// 					today: {
// 						left: getLeftValue(answer.today!),
// 						top: topVal,
// 					},
// 					tomorrow: {
// 						left: getLeftValue(answer.tomorrow!, true),
// 						top: topVal,
// 					},
// 				}
// 			}),
// 		)
// 	})
