import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

export type Answer = {
	today?: { top: number; left: number }
	tomorrow?: { top: number; left: number }
}

export type Answers = {
	[key: string]: Answer
}

export type QuadrantsParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Answers
		}
	}
}
