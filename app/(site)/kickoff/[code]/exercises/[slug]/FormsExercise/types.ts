import type { ST } from "@/sanity/config"

export type ListFieldAnswer = {
	type: "List"
	responses: string[]
}

export type TextFieldAnswer = {
	type: "Text"
	response: string
}

export type FormAnswer = {
	data: ListFieldAnswer | TextFieldAnswer
}

// TODO: Create a shared type for the mapped exercise ids.
export type FormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			steps: Array<FormAnswer>
		}
	}
}
