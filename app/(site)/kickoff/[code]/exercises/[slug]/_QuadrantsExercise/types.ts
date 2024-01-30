import type { ST } from "@/sanity/config"

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
}

export type QuadrantsExercise = ST["exercise"] & {
	answers?: QuadrantsAnswers
}
