import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import { BackToRegister } from "./BackToRegister"
import { Scroller } from "./Scroller"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const KickoffPage = async (props: Props) => {
	const participant = await client.findParticipantOrThrow()
	if (participant.onboarded) redirect(`/kickoff/${props.params.code}/exercises`)

	async function onboard() {
		"use server"

		await client.onboardParticipant(participant._id)
		redirect(`/kickoff/${props.params.code}/exercises`)
	}

	return (
		<LightLayout mainClassName="mt-2">
			<div>
				<Text asChild style="heading" size={56} className="max-w-[276px]">
					<h1>Welcome, {participant.name}</h1>
				</Text>

				<BackToRegister code={props.params.code} text="Not you?" />
			</div>

			<form
				action={onboard}
				className="relative flex grow flex-col py-10 text-center"
			>
				<Scroller />
			</form>
		</LightLayout>
	)
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	return {
		title: `${props.params.code} - W|W Workshop`,
	}
}

export default KickoffPage
