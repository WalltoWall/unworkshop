import type { ST } from "@/sanity/config"

export type BrainstormCardActions = {
	addCard: (response: string) => void
	editCard: (id: string, response: string) => void
	deleteCard: (id: string) => void
}

export type BrainstormCard = {
	id: string
	response: string
	createdAt: string
}

export type BrainstormAnswer = {
	columns?: Array<BrainstormColumn>
	unsorted?: Array<BrainstormCard>
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
		participants: Record<string, BrainstormAnswer>
		groups: Record<string, BrainstormAnswer>
	}>
}

export type BrainstormParticipant = ST["participant"]

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
