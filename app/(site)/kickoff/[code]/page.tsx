import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
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

		noStore()

		await client.onboardParticipant(participant._id)
		redirect(`/kickoff/${props.params.code}/exercises`)
	}

	return (
		<LightLayout mainClassName="mt-2">
			<div>
				<h1>
					<Text asChild style="heading" size={64}>
						<div>Welcome</div>
					</Text>
					<Text asChild style="serif" size={56} className="mt-5">
						<div>{participant.name}</div>
					</Text>
				</h1>

				<Text
					style="copy"
					size={12}
					className="mt-4 block text-gray-50 underline"
					asChild
				>
					<Link href={`/kickoff/register?code=${props.params.code}`}>
						Not you?
					</Link>
				</Text>
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
