import type { ST } from "@/sanity/config"

export type BrainstormCard = {
	id: string
	response: string
	createdAt: number
	participantOrGroupId: string
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
		columns: Array<BrainstormColumn>
		unsorted: Array<BrainstormCard>
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
