import type { ST } from "@/sanity/config"

export type Group = {
	[participantId: string]: "captain" | "contributor"
}

export type Groups = {
	[groupSlug: string]: Group
}

export type GroupParticipant = ST["participant"]

export type ExerciseAnswers = {
	participants: Record<string, any>
	groups: Groups
}

export type GroupExercise = ST["exercise"] & {
	answers?: ExerciseAnswers
}
