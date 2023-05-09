import { cookies } from "next/headers"
import { PARTICIPANT_COOKIE } from "@/constants"
import type { Metadata } from "next"
import { findKickoff, findParticipant } from "@/sanity/client"
import { notFound, redirect } from "next/navigation"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

function redirectToRegister(code: string): never {
	redirect("/kickoff/register?code=" + code)
}

const KickoffPage = async (props: Props) => {
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

	return <div className="dynamic-screen bg-white text-black">Kickoff</div>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	return {
		title: `${props.params.code} - W|W Workshop`,
	}
}

export default KickoffPage
