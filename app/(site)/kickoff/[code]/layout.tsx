import { PARTICIPANT_COOKIE } from "@/constants"
import { findParticipant } from "@/sanity/client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type KickoffLayoutProps = {
	params: { code: string }
	children: React.ReactNode
}

const KickoffLayout = async ({ children, params }: KickoffLayoutProps) => {
	const cookiesStore = cookies()
	const urlParams = new URLSearchParams(params)
	const participantId = cookiesStore.get(PARTICIPANT_COOKIE)?.value

	if (!participantId) {
		redirect("/kickoff/register?" + urlParams.toString())
	}

	const participant = await findParticipant(participantId)
	if (!participant) {
		//@ts-expect-error - NextJS types are incorrect.
		cookiesStore.delete(PARTICIPANT_COOKIE)

		redirect("/kickoff/register?" + urlParams.toString())
	}

	return <div className="dynamic-screen bg-white text-black">{children}</div>
}

export default KickoffLayout
