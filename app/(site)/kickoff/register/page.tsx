import type { Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { cookies } from "next/headers"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"
import { uid } from "uid"
import { z } from "zod"
import { zfd } from "zod-form-data"
import { LightLayout } from "@/components/LightLayout"
import { Logo } from "@/components/Logo"
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

		noStore()

		const form = Form.parse(data)
		const participant = await client.registerParticipant({
			name: form.name,
			kickoffId: kickoff!._id,
			recoveryCode: uid(),
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
			<div className="max-w-[290px]">
				<Text asChild style="copy" size={48} className="font-bold">
					<h1>Hey, {kickoff.title}.</h1>
				</Text>
				<br />
				<div className="flex w-full flex-wrap items-center">
					<Text asChild style="copy" size={48} className="font-bold">
						<h1>Let's</h1>
					</Text>
					<div className="ml-3 flex items-center">
						<Logo className="-mr-2 w-[53px]" />
						<Text asChild style="copy" size={48} className="font-bold">
							<h1>ravel</h1>
						</Text>
					</div>
				</div>
				<br />
				<Text asChild style="copy" size={48} className="font-bold">
					<h1>your brand.</h1>
				</Text>
			</div>

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
				<Text style="heading" size={24} asChild className="text-green-40">
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
