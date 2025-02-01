import Link from "next/link"
import { Logo } from "@/components/Logo"

type Params = { code: string }
type Props = {
	params: Promise<Params>
	children: React.ReactNode
}

export default async function KickoffLayout(props: Props) {
	const params = await props.params

	return (
		<div className="mx-auto flex min-h-svh w-full max-w-[32rem] flex-col px-7 pb-16 text-black">
			<header className="flex items-center justify-between gap-2 pt-4.5 pb-6">
				<Link href={`/kickoff/${params.code}`}>
					<Logo className="w-[46px]" />
				</Link>
			</header>

			<main id="main" className="grow">
				{props.children}
			</main>
		</div>
	)
}
