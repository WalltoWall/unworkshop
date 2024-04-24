import type * as ST from "@/sanity/types.gen"

export type Role = "captain" | "contributor" | "unset"

export type Group = {
	[participantId: string]: Role
}

export type Groups = {
	[groupSlug: string]: Group
}

export type GroupParticipant = ST.Participant

export type ExerciseAnswers = {
	participants: Record<string, any>
	groups: Groups
}

export type GroupExercise = ST.Exercise & {
	answers?: ExerciseAnswers
}
