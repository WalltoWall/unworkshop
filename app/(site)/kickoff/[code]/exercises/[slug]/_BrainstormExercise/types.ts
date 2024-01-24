import type { ST } from "@/sanity/config"
import type { GroupAnswer, IndividualAnswer } from "@/types"

export type Answer = {
	id: string
	response: string
	step?: number
}

export type BrainstormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Array<Answer>
		}
	}
}
