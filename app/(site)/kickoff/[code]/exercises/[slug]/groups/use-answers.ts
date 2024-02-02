import type { ExerciseAnswers } from "./types"

export const useAnswers = (snap: ExerciseAnswers, participantId: string) => {
	const group = snap?.groups?.[participantId]

	let participantOrGroupId = group ? group.slug : participantId

	let answers = snap.participants?.[participantOrGroupId]

	return { answers, role: group?.role }
}
