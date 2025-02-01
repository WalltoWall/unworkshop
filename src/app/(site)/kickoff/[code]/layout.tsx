import type { Viewport } from "next"
import Link from "next/link"
import { ClientOnly } from "@/components/client-only"
import { Logo } from "@/components/Logo"
import { Modal } from "@/components/modal"
import { ParticipantGreeting } from "./participant-greeting"

type Params = { code: string }
type Props = {
	params: Promise<Params>
	children: React.ReactNode
}

export default async function KickoffLayout(props: Props) {
	const params = await props.params

	return (
		<>
			<div className="mx-auto flex min-h-svh w-full max-w-[32rem] flex-col px-7 pb-16 text-black lg:pb-4.5">
				<header className="flex items-center justify-between gap-2 pt-4.5 pb-6">
					<Link href={`/kickoff/${params.code}`}>
						<Logo className="w-[46px]" />
					</Link>

					<ClientOnly>
						<ParticipantGreeting />
					</ClientOnly>
				</header>

				<main id="main" className="flex grow flex-col">
					{props.children}
				</main>
			</div>

			<ClientOnly>
				<Modal.Component />
			</ClientOnly>
		</>
	)
}

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: "#fff",
}
