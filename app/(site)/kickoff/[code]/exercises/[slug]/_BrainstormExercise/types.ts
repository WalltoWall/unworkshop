import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

export type Answer = {
	id: string
	response: string
	step?: number
}

export type BrainstormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Array<Answer>
		}
	}
}

export type BrainstormExercise = ST["exercise"] & {
	answers?: Array<{
		columnId: string
		color: string
		title: string
		cards: Array<string>
	}>
}

export type Color = "green" | "red" | "yellow"

export interface CardScrollerProps {
	cards: Array<Answer>
	exerciseId: string
	group: boolean
	color?: Color
	step: number
}

export interface AddCardData {
	id: string
	exerciseId: string
	isGroup: boolean
	step: number
}
