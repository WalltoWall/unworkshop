import Link from "next/link"
import { Logo } from "@/components/Logo"

export const DarkLayout = (props: { children: React.ReactNode }) => {
	return (
		<main
			id="main"
			className="grid h-[100svh] overflow-hidden bg-black text-white"
		>
			<div className="mx-auto flex max-w-md flex-col justify-between">
				<Link href="/">
					<Logo className="relative -right-10 -top-10 ml-auto w-[325px]" />
				</Link>

				{props.children}
			</div>
		</main>
	)
}
