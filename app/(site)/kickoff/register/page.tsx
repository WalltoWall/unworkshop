import type { Metadata } from "next"
import { cookies } from "next/headers"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { LightLayout } from "@/components/LightLayout"
import { Text } from "@/components/Text"
import { client } from "@/sanity/client"
import registerIllustration from "@/assets/images/register-illustration.jpg"
import { PARTICIPANT_COOKIE } from "@/constants"
import { RegisterInput } from "./RegisterInput"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const Form = zfd.formData({ name: zfd.text() })

const KickoffRegisterPage = async (props: Props) => {
	const code = z.string().parse(props.searchParams.code)
	const [kickoff, participant] = await Promise.all([
		client.findKickoff(code),
		client.findParticipantViaCookie(),
	])

	if (!kickoff) notFound()
	if (participant && participant.onboarded && participant.kickoff.code === code)
		redirect(`/kickoff/${code}/exercises`)

	async function register(data: FormData) {
		"use server"

		const form = Form.parse(data)
		const participant = await client.registerParticipant({
			name: form.name,
			kickoffId: kickoff!._id,
		})

		cookies().set({
			name: PARTICIPANT_COOKIE,
			value: participant._id,
			httpOnly: true,
		})

		redirect(`/kickoff/${code}`)
	}

	return (
		<LightLayout withHeaderBackButton mainClassName="justify-between">
			<Text asChild style="heading" size={56} className="max-w-[276px]">
				<h1>{kickoff.title}</h1>
			</Text>

			<Image
				src={registerIllustration}
				alt=""
				placeholder="blur"
				className="mt-4"
			/>

			<form
				action={register}
				className="mt-8 flex flex-col items-center text-center"
			>
				<Text style="heading" size={24} asChild>
					<h2>Let's get started</h2>
				</Text>

				<RegisterInput />

				<Text style="copy" size={12} className="mt-3 text-black/50">
					Don't worry, your answers will be anonymous.
				</Text>
			</form>
		</LightLayout>
	)
}

export const metadata: Metadata = {
	title: "Register - W|W Workshop",
}

export default KickoffRegisterPage
