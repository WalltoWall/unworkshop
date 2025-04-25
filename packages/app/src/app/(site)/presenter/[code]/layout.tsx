import Link from "next/link"
import { notFound } from "next/navigation"
import { Logo } from "@/components/Logo"
import { Api } from "@/sanity/client"
import { text } from "@/styles/text"
import { NavSheet } from "./nav-sheet"

type Params = { code: string }
type Props = { params: Promise<Params>; children: React.ReactNode }

export default async function PresenterLayout(props: Props) {
	const params = await props.params
	const kickoff = await Api.getKickoff(params.code)
	if (!kickoff) notFound()

	return (
		<div className="flex h-svh flex-col">
			<header className="flex items-center justify-between gap-5 bg-black px-5 py-4.5 text-white">
				<Link className="flex gap-5" href={`/presenter/${params.code}`}>
					<Logo className="size-13 text-white" />

					<h1 className={text({ size: 48, style: "heading" })}>
						{kickoff.title}
					</h1>
				</Link>

				<NavSheet exercises={kickoff.exercises} />
			</header>

			<main className="flex grow flex-col">{props.children}</main>
		</div>
	)
}
