import type { ST } from "@/sanity/config"

export type Group = {
	slug: string
	role: "captain" | "contributor"
}

export type GroupParticipant = ST["participant"]

export type ExerciseAnswers = {
	participants: Record<string, any>
	groups: Record<string, Group>
}

export type GroupExercise = ST["exercise"] & {
	answers?: ExerciseAnswers
}
