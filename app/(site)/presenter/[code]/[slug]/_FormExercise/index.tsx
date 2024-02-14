import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { type FormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { FormResponses } from "./FormResponses"

type Props = {
	exercise: ST["exercise"]
	kickoff: ST["kickoff"]
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
