import type { ST } from "@/sanity/config"

type IndividualAnswer = { type: "individual"; leader: undefined }
type GroupAnswer = { type: "group"; leader: string }

export type BrainstormCardActions = {
	addCard: (response: string) => void
	editCard: (id: string, response: string) => void
	deleteCard: (id: string) => void
}

export type BrainstormAnswer = {
	id: string
	response: string
	step?: number
}

export type BrainstormCard = {
	id: string
	response: string
	participantId: string
	createdAt: string
}

export type BrainstormColumn = {
	id: string
	cards: Array<BrainstormCard>
	color: string
	title: string
}

export type BrainstormAnswers = {
	type?: "brainstorm"
	steps?: Array<{
		columns: Array<BrainstormColumn>
		unsorted: Array<BrainstormCard>
	}>
}

export type BrainstormParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			answers?: Array<BrainstormAnswer>
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

export interface AddCardData {
	id: string
	exerciseId: string
	step: number
}
