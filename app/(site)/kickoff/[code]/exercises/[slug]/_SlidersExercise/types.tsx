import type { ST } from "@/sanity/config"
import { GroupAnswer, IndividualAnswer } from "@/types"

export type Answer = {
	question_text: string
	value: number
}

export type SlidersParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Array<Answer>
		}
	}
}
