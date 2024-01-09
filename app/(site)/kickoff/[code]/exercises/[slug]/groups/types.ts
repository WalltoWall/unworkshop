import type { ST } from "@/sanity/config"

export type GroupParticipant = ST["participant"] & {
	groups?: {
		[exerciseId: string]: {
			group: string
			role: string
		}
	}
}
