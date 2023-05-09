import { cookies } from "next/headers"
import { PARTICIPANT_COOKIE } from "@/constants"
import type { Metadata } from "next"
import { findKickoff, findParticipant } from "@/sanity/client"
import { notFound, redirect } from "next/navigation"
import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { Scroller } from "./Scroller"

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

	if (participant.onboarded) redirect(`/kickoff/${props.params.code}/exercises`)

	return (
		<LightLayout mainClassName="mt-2">
			<div>
				<Text asChild style="heading" size={56} className="max-w-[276px]">
					<h1>Welcome, {participant.name}</h1>
				</Text>

				<Text style="copy" size={12} className="mt-4 text-gray-50 underline">
					Not you?
				</Text>
			</div>

			<Scroller />
		</LightLayout>
	)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	return {
		title: `${props.params.code} - W|W Workshop`,
	}
}

export default KickoffPage
