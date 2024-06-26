import type * as ST from "@/sanity/types.gen"
import type { Group } from "../groups/types"

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
	groups: Record<string, Group>
}

export type BrainstormParticipant = ST.Participant

export type BrainstormExercise = ST.Exercise & {
	answers?: BrainstormAnswers
}

export type Color = "green" | "red" | "yellow"

export interface AddCardData {
	id: string
	exerciseId: string
	step: number
}
