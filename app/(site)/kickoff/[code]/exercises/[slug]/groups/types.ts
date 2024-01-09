import type { ST } from "@/sanity/config"

export type IndividualAnswer = {
	type: "individual"
	group: undefined
	role: undefined
}
export type GroupAnswer = { type: "group"; group: string; role: string }

export type GroupParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers: any
		}
	}
}
