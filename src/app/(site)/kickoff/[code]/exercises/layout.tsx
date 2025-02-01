import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LightLayout } from "@/components/LightLayout"
import { client } from "@/sanity/client"
import { PARTICIPANT_COOKIE } from "@/constants"
import { ParticipantModal } from "./ParticipantModal"

type Params = { code: string }
type Props = {
	children: React.ReactNode
	params: Promise<Params>
}

const ExercisesLayout = async (props: Props) => {
	const participant = await client.findParticipantOrThrow()
	const params = await props.params

	async function removeParticipantCookie() {
		"use server"

		const cookiesStore = await cookies()

		cookiesStore.delete(PARTICIPANT_COOKIE)
		redirect("/kickoff/register?code=" + params.code)
	}

	return (
		<LightLayout
			mainClassName="mt-3.5"
			headerChildren={
				<ParticipantModal
					participantName={participant.name}
					heading="Not You?"
					message="Press the confirm button to re-register under a new name."
					code={params.code}
					onConfirmAction={removeParticipantCookie}
				/>
			}
		>
			{props.children}
		</LightLayout>
	)
}

export default ExercisesLayout
