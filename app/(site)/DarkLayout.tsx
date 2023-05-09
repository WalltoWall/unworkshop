import { Logo } from "@/components/Logo"
import Link from "next/link"

export const DarkLayout = (props: { children: React.ReactNode }) => {
	return (
		<main
			id="main"
			className="dynamic-screen overflow-hidden bg-black text-white"
		>
			<div className="mx-auto flex h-full max-w-md flex-col justify-between">
				<Link href="/">
					<Logo className="relative -right-10 -top-10 ml-auto w-[325px]" />
				</Link>

				{props.children}
			</div>
		</main>
	)
}
