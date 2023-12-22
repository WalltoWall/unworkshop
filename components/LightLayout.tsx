import Link from "next/link"
import { cx } from "class-variance-authority"
import { Chevron } from "@/components/icons/Chevron"
import { Logo } from "@/components/Logo"
import { LightLayoutThemeSwapper } from "./LightLayoutThemeSwapper"

export const LightLayout = (props: {
	headerChildren?: React.ReactNode
	children?: React.ReactNode
	mainClassName?: string
	withHeaderBackButton?: boolean
}) => {
	return (
		<>
			<div className="flex h-[100svh] flex-col bg-white px-7 pb-8 text-black">
				<header
					className="flex items-center justify-between pb-6 pt-[18px] data-[theme=dark]:bg-black data-[theme=light]:bg-white"
					data-theme="light"
				>
					{props.withHeaderBackButton && (
						<Link
							href="/"
							className="flex h-6 w-6 items-center justify-center rounded"
						>
							<span className="sr-only">Go back</span>
							<Chevron className="w-2" />
						</Link>
					)}

					<Link href="/">
						<Logo className="w-[46px]" />
					</Link>

					{props.headerChildren}
				</header>

				<main
					id="main"
					className={cx(
						"flex grow flex-col overflow-hidden",
						props.mainClassName,
					)}
				>
					{props.children}
				</main>
			</div>

			<LightLayoutThemeSwapper />
		</>
	)
}
