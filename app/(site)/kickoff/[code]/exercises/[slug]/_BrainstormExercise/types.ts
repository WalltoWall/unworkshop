import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

export type Answer = {
	id: string
	response: string
}

export type BrainstormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Array<Answer>
		}
	}
}

export type BrainstormPresenterAnswers = ST["exercise"] & {
	answers?: {
		[columnId: string]: Array<Answer>
	}
}
