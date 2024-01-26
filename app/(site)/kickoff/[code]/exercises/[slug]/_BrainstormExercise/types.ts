import type { ST } from "@/sanity/config"

export type BrainstormCardActions = {
	addCard: (args: { response: string; participantId: string }) => void
	editCard: (args: {
		cardId: string
		response: string
		participantId: string
	}) => void
	deleteCard: (args: { cardId: string; participantId: string }) => void
}

export type BrainstormCard = {
	id: string
	response: string
	createdAt: number
}

export type BrainstormAnswer = {
	columns: Array<BrainstormColumn>
	unsorted: Array<BrainstormCard>
}

export type BrainstormColumn = {
	id: string
	cards: Array<BrainstormCard>
	color: string
	title: string
}

export type BrainstormAnswers = {
	steps: Array<{
		participants: Record<string, BrainstormAnswer>
		groups: Record<string, BrainstormAnswer>
	}>
}

export type BrainstormParticipant = ST["participant"]

export type BrainstormExercise = ST["exercise"] & {
	answers?: BrainstormAnswers
}

export type Color = "green" | "red" | "yellow"

export interface AddCardData {
	id: string
	exerciseId: string
	step: number
}
