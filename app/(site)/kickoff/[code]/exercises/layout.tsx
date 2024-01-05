import Link from "next/link"
import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { ParticipantModal } from "./ParticipantModal"

const ExercisesLayout = async (props: {
	children: React.ReactNode
	params: { code: string }
}) => {
	const participant = await client.findParticipantOrThrow()

	return (
		<LightLayout
			mainClassName="mt-3.5"
			headerChildren={
				<ParticipantModal
					participantName={participant.name}
					heading="Not You?"
					message="Press the confirm button to register as a different user."
					code={props.params.code}
				/>
			}
		>
			{props.children}
		</LightLayout>
	)
}

export default ExercisesLayout
