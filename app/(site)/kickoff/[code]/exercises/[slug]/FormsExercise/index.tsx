import { client } from "@/sanity/client"
import type { ST } from "@/sanity/config"
import { Form } from "./Form"
import type { FormParticipant } from "./types"

type Props = {
	exercise: ST["exercise"]
	kickoffCode: string
}

export const FormExercise = async ({ exercise, kickoffCode }: Props) => {
	const participant = await client.findParticipantOrThrow<FormParticipant>()

	return (
		<Form
			exercise={exercise}
			participant={participant}
			kickoffCode={kickoffCode}
		/>
	)
}
