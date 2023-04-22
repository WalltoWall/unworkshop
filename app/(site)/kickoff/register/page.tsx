import { Logo } from "@/components/Logo"
import { z } from "zod"
import { BackButton } from "./BackButton"
import type { Metadata } from "next"
import Link from "next/link"
import { client } from "@/sanity/client"
import { Text } from "@/components/Text"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const KickoffRegisterPage = async (props: Props) => {
	const code = z.string().parse(props.searchParams.code)
	const kickoff = await client.findKickoff(code)

	return (
		<div className="dynamic-screen flex flex-col bg-white px-7 text-black">
			<header className="flex items-center justify-between py-3.5">
				<BackButton />
				<Link href="/">
					<Logo className="w-[46px]" />
				</Link>
			</header>

			<main id="main" className="grow">
				<Text asChild style="heading" size={56} className="max-w-[276px]">
					<h1>{kickoff.title}</h1>
				</Text>
			</main>
		</div>
	)
}

export const metadata: Metadata = {
	title: "Register - W|W Workshop",
}

export default KickoffRegisterPage
