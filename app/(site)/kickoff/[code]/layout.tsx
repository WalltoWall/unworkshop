import { PARTICIPANT_COOKIE } from "@/constants"
import { findKickoff, findParticipant } from "@/sanity/client"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

function redirectToRegister(code: string): never {
	redirect("/kickoff/register?code=" + code)
}

type Props = {
	children: React.ReactNode
	params: { code: string }
}

const KickoffLayout = async (props: Props) => {
	const participantId = cookies().get(PARTICIPANT_COOKIE)?.value
	if (!participantId) redirectToRegister(props.params.code)

	const [participant, kickoff] = await Promise.all([
		findParticipant(participantId),
		findKickoff(props.params.code),
	])

	// If this participant was registered to a different Kickoff, redirect them
	// to re-register too.
	if (!participant || participant.kickoff._ref !== kickoff?._id)
		redirectToRegister(props.params.code)
	if (!kickoff) notFound()

	return <>{props.children}</>
}

export default KickoffLayout
