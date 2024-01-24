import type { ST } from "@/sanity/config"
import type { GroupAnswer, IndividualAnswer } from "@/types"

export type GroupParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: any
			steps?: any
		}
	}
}
