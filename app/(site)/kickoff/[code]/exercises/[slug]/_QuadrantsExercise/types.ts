import type * as ST from "@/sanity/types.gen"
import type { Group } from "../groups/types"

export type Answer = {
	today?: { top: number; left: number }
	tomorrow?: { top: number; left: number }
}

export type QuadrantAnswers = {
	[slug: string]: Answer
}

export type QuadrantsParticipant = ST.Participant

export type QuadrantsAnswers = {
	participants: Record<string, QuadrantAnswers>
	groups: Record<string, Group>
}

export type QuadrantsExercise = ST.Exercise & {
	answers?: QuadrantsAnswers
}
