import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

export type Answer = {
	id: string
	today: { top: number; left: number; placed: boolean }
	tomorrow: { top: number; left: number; placed: boolean }
	arrow: { top: number; left: number; width: number; angle: number }
}

export type QuadrantsParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Array<Answer>
		}
	}
}
