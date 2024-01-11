import { cookies } from "next/headers"
import { LightLayout } from "@/components/LightLayout"
import { client } from "@/sanity/client"
import { PARTICIPANT_COOKIE } from "@/constants"
import { ParticipantModal } from "./ParticipantModal"

const ExercisesLayout = async (props: {
	children: React.ReactNode
	params: { code: string }
}) => {
	const participant = await client.findParticipantOrThrow()

	async function removeParticipantCookie() {
		"use server"

		cookies().delete(PARTICIPANT_COOKIE)
	}

	return (
		<LightLayout
			mainClassName="mt-3.5"
			headerChildren={
				<ParticipantModal
					participantName={participant.name}
					heading="Not You?"
					message="Press the confirm button to re-register under a new name."
					code={props.params.code}
					onConfirm={removeParticipantCookie}
				/>
			}
		>
			{props.children}
		</LightLayout>
	)
}

export default ExercisesLayout
