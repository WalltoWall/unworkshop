import type { ST } from "@/sanity/types.gen"
import type { Role } from "./GroupForm"

export type Group = {
	[participantId: string]: Role
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
