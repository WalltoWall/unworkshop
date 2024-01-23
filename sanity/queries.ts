import { groq } from "next-sanity"
import type {
	BrainstormExercise,
	BrainstormParticipant,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"

export const allParticipantsInExerciseQuery = groq`*[_type == "participant" && answers[$exerciseId] != null]{
    ...,
    answers
}`

export const brainstormExerciseDataQuery = groq`{
    "participants": *[_type == "participant" && answers[$exerciseId] != null]{
    ...,
    answers
    },
    "exercise": *[_type == "exercise" && _id == $exerciseId][0]
}`

export type BrainstormExerciseDataQueryResult = {
	participants: Array<BrainstormParticipant>
	exercise: BrainstormExercise
}
