import { client } from "@/sanity/client"
import type * as ST from "@/sanity/types.gen"
import { type FormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { FormResponses } from "./FormResponses"

type Props = {
	exercise: ST.Exercise
	kickoff: ST.Kickoff
}

export const FormPresenterView = async (props: Props) => {
	const participants = await client.findAllParticipantsInKickoff(
		props.kickoff._id,
	)

	const participantsById: Record<string, FormParticipant> = {}
	participants.forEach((p) => (participantsById[p._id] = p))

	return (
		<FormResponses participants={participantsById} exercise={props.exercise} />
	)
}
