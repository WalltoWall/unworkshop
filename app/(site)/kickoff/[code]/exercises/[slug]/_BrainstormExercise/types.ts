import type { ST } from "@/sanity/config"

type InvdividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

export type Answer = { id: string; response: string; delete?: boolean }

export type BrainstormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: InvdividualAnswer | GroupAnswer
			answers?: Array<Answer>
		}
	}
}
