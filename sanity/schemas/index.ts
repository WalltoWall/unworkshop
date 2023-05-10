import { Exercise } from "./documents/Exercise"
import { Kickoff } from "./documents/Kickoff"
import { Participant } from "./documents/Participant"

export const schemaTypes = [
	Kickoff.schema(),
	Participant.schema(),
	Exercise.schema(),
]
