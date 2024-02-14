import type { ST } from "@/sanity/config"
import type { Group } from "../groups/types"

export type Answer = {
	today?: { top: number; left: number }
	tomorrow?: { top: number; left: number }
}

export type QuadrantAnswers = {
	[slug: string]: Answer
}

export type QuadrantsParticipant = ST["participant"]

export type QuadrantsAnswers = {
	participants: Record<string, QuadrantAnswers>
	groups: Record<string, Group>
}

export type QuadrantsExercise = ST["exercise"] & {
	answers?: QuadrantsAnswers
}
