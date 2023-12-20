import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

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
