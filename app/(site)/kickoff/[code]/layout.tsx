import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { client } from "@/sanity/client"
import { PARTICIPANT_COOKIE } from "@/constants"

function redirectToRegister(code: string): never {
	redirect("/kickoff/register?code=" + code)
}

type Params = { code: string }
type Props = {
	params: Promise<Params>
	children: React.ReactNode
}

const KickoffLayout = async (props: Props) => {
	const cookiesStore = await cookies()
	const params = await props.params
	const participantId = cookiesStore.get(PARTICIPANT_COOKIE)?.value
	if (!participantId) redirectToRegister(params.code)

	const [participant, kickoff] = await Promise.all([
		client.findParticipant(participantId),
		client.findKickoff(params.code),
	])

	// If this participant was registered to a different Kickoff, redirect them
	// to re-register too.
	if (!participant || participant.kickoff._ref !== kickoff?._id)
		redirectToRegister(params.code)
	if (!kickoff) notFound()

	return props.children
}

export default KickoffLayout
