import type { ST } from "@/sanity/config"

type IndividualAnswer = {
	type: "individual"
	group: undefined
	leader: undefined
}
type GroupAnswer = { type: "group"; group: string; leader: string }

export type Answer = {
	today?: { top: number; left: number }
	tomorrow?: { top: number; left: number }
}

export type Answers = {
	[key: string]: Answer
}

export type Group = {
	group: string
	role: "captain" | "contributor"
}

export type QuadrantsParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Answers
		}
	}
	groups?: {
		[exerciseId: string]: Group
	}
}
