import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { type FormParticipant } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { FormResponses } from "./FormResponses"

type Props = {
	exercise: ST["exercise"]
}

export const FormPresenterView = async (props: Props) => {
	const participants =
		await client.findAllParticipantsInExercise<FormParticipant>(
			props.exercise._id,
		)

	return <FormResponses participants={participants} exercise={props.exercise} />
}
