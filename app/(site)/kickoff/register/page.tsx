import { Logo } from "@/components/Logo"
import Image from "next/image"
import { z } from "zod"
import type { Metadata } from "next"
import Link from "next/link"
import * as client from "@/sanity/client"
import { Text } from "@/components/Text"
import { notFound, redirect } from "next/navigation"
import { Arrow } from "@/components/icons/Arrow"
import { Chevron } from "@/components/icons/Chevron"
import { zfd } from "zod-form-data"
import { PARTICIPANT_COOKIE } from "@/constants"
import { cookies } from "next/headers"
import registerIllustration from "@/assets/images/register-illustration.jpg"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const Form = zfd.formData({ name: zfd.text() })

const KickoffRegisterPage = async (props: Props) => {
	const code = z.string().parse(props.searchParams.code)
	const kickoff = await client.findKickoff(code)
	if (!kickoff) notFound()

	async function register(data: FormData) {
		"use server"

		const form = Form.parse(data)
		const participant = await client.registerParticipant({
			name: form.name,
			kickoffId: kickoff!._id,
		})

		//@ts-expect-error - NextJS types are incorrect.
		cookies().set({
			name: PARTICIPANT_COOKIE,
			value: participant._id,
			httpOnly: true,
		})

		redirect(`/kickoff/${code}`)
	}

	return (
		<div className="dynamic-screen flex flex-col bg-white px-7 pb-8 text-black">
			<header className="flex items-center justify-between py-3.5">
				<Link
					href="/"
					className="flex h-6 w-6 items-center justify-center rounded outline-none focus:ring-2"
				>
					<span className="sr-only">Go back</span>
					<Chevron className="w-2" />
				</Link>

				<Link href="/">
					<Logo className="w-[46px]" />
				</Link>
			</header>

			<main id="main" className="flex grow flex-col justify-between">
				<Text asChild style="heading" size={56} className="max-w-[276px]">
					<h1>{kickoff.title}</h1>
				</Text>

				<Image
					src={registerIllustration}
					alt=""
					placeholder="blur"
					className="mt-4"
				/>

				<div className="mt-8 flex flex-col items-center text-center">
					<Text style="heading" size={24} asChild>
						<h2>Let's get started</h2>
					</Text>

					<form
						action={register}
						className="relative mt-6 flex w-full items-center rounded-md bg-black/10 px-3 ring-black ring-offset-4 ring-offset-white focus-within:ring-2"
					>
						<input
							type="text"
							placeholder="Add your first & last name here"
							className="h-12 w-full bg-transparent outline-none leading-none placeholder:text-black/60"
							name="name"
							autoComplete="name"
						/>

						<button className="w-3.5 shrink-0">
							<Arrow />
						</button>
					</form>

					<Text style="copy" size={12} className="mt-3 text-black/50">
						Don't worry, your answers will be anonymous.
					</Text>
				</div>
			</main>
		</div>
	)
}

export const metadata: Metadata = {
	title: "Register - W|W Workshop",
}

export default KickoffRegisterPage
