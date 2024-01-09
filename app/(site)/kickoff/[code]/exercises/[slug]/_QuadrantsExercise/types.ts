import type { ST } from "@/sanity/config"
import type { GroupAnswer, IndividualAnswer } from "../groups/types"

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
