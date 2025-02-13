import type { Metadata, Viewport } from "next"
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

type Params = { code: string }
type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
	params: Promise<Params>
	searchParams: Promise<SearchParams>
}

const Form = zfd.formData({ name: zfd.text() })

const KickoffRegisterPage = async (props: Props) => {
	const searchParams = await props.searchParams
	const code = z.string().parse(searchParams.code)
	const [kickoff, participant] = await Promise.all([
		client.findKickoff(code),
		client.findParticipantViaCookie(),
	])

	if (!kickoff) notFound()
	if (participant && participant.kickoff.code === code)
		redirect(`/kickoff/${code}/exercises`)

	async function register(data: FormData) {
		"use server"

		noStore()
		const cookiesStore = await cookies()

		const form = Form.parse(data)
		const participant = await client.registerParticipant({
			name: form.name,
			kickoffId: kickoff!._id,
			recoveryCode: uid(),
		})

		cookiesStore.set({
			name: PARTICIPANT_COOKIE,
			value: participant._id,
			httpOnly: true,
			maxAge: 604800, // 7 days
		})

		redirect(`/kickoff/${code}/exercises`)
	}

	return (
		<LightLayout withHeaderBackButton mainClassName="justify-between">
			<div className="space-y-3">
				<Text style="heading" size={64} className="!normal-case">
					{kickoff.greeting}
				</Text>

				<div className="flex w-full flex-wrap items-center">
					<Text size={64} style="heading" className="!normal-case">
						Let's
					</Text>

					<div className="ml-3 flex items-center">
						<Logo className="-mr-1.5 w-[53px] rotate-6" />
						<Text size={64} style="heading" className="!normal-case">
							ravel
						</Text>
					</div>
				</div>

				<Text size={64} style="heading" className="!normal-case">
					your brand.
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
	title: "Register - UnWorkshop",
}

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#fff",
}

export default KickoffRegisterPage
