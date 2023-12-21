"use client"

import { useState } from "react"
import Link from "next/link"
import { cx } from "class-variance-authority"
import { Hamburger } from "@/components/icons/Hamburger"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"

interface PresenterHeaderProp {
	kickoffCode?: string
	exercises?: Array<ST["exercise"]>
	activeExercise?: ST["exercise"]
	heading?: string
}

export const PresenterHeader = ({
	kickoffCode,
	exercises,
	activeExercise,
	heading,
}: PresenterHeaderProp) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className="relative z-50 flex h-[5.5rem] items-center bg-black px-8 py-[1.125rem]">
			<Link href="/presenter">
				<Logo className="h-[3.25rem] w-[3.25rem] text-white" />
			</Link>

			{heading && (
				<Text
					size={48}
					className="ml-10 font-bold uppercase text-white font-heading"
				>
					{heading}
				</Text>
			)}

			{exercises && (
				<>
					<Hamburger open={isOpen} setOpen={setIsOpen} />

					<nav
						className={cx(
							"fixed right-0 top-0 h-[100vh] w-[23.75rem] overflow-auto bg-yellow-59 px-6 pb-6 pt-24 shadow-md transition-transform duration-500",
							isOpen ? "translate-x-0" : "translate-x-full",
						)}
					>
						<ul>
							{exercises.map((exercise) => (
								<li key={exercise._id} className="mb-6">
									<Link
										className={cx(
											"relative inline-block pb-1 uppercase text-48 font-heading capsize before:absolute before:bottom-0 before:left-0 before:h-[0.1875rem] before:w-full hover:before:bg-black focus:before:bg-black",
											activeExercise &&
												activeExercise.name === heading &&
												"before:bg-black",
										)}
										href={`/presenter/${kickoffCode}/${exercise.slug.current}`}
									>
										{exercise.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</>
			)}
		</header>
	)
}
