"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
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
	const pathname = usePathname()
	const params = useParams()

	return (
		<>
			<div className="mx-auto flex min-h-svh w-full max-w-[32rem] flex-col bg-white px-7 pb-16 text-black">
				<header
					className="flex items-center justify-between gap-2 pb-6 pt-[18px] data-[theme=dark]:bg-black data-[theme=light]:bg-white"
					data-theme="light"
				>
					{props.withHeaderBackButton && (
						<Link
							href={pathname.split("/").slice(0, -1).join("/")}
							className="flex h-6 w-6 items-center justify-center rounded"
						>
							<span className="sr-only">Go back</span>
							<Chevron className="w-2" />
						</Link>
					)}

					<Link href={params.code ? `/kickoff/${params.code}/exercises` : "/"}>
						<Logo className="w-[46px]" />
					</Link>

					{props.headerChildren}
				</header>

				<main
					id="main"
					className={cx("flex flex-[1_1_0] flex-col", props.mainClassName)}
				>
					{props.children}
				</main>
			</div>

			<LightLayoutThemeSwapper />
		</>
	)
}
