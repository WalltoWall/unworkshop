"use client"

import { useState, type ChangeEvent } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cx } from "class-variance-authority"
import { Chevron } from "@/components/icons/Chevron"
import { Hamburger } from "@/components/icons/Hamburger"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"
import { QuadrantsHeaderNav } from "./[code]/[slug]/_QuadrantsExercise/QuadrantsHeaderNav"

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
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	const steps = activeExercise?.quadrants
		? activeExercise.quadrants.length
		: null

	const [isOpen, setIsOpen] = useState(false)

	const changeStep = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams({
			step: event.target.value.toString(),
		})

		router.push(pathname + "?" + params.toString(), { scroll: false })
	}

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

			{steps && (
				<div className="relative mx-6">
					<select
						value={step}
						onChange={changeStep}
						className="h-9 min-w-28 appearance-none rounded-lg border border-gray-58 bg-black pl-2 pr-7 pt-1 uppercase text-white text-18 font-heading"
					>
						{[...Array(steps)].map((_, index) => (
							<option key={index} value={index + 1}>
								Step {index + 1}
							</option>
						))}
					</select>

					<Chevron className="absolute right-2 top-3 h-[0.75rem] -rotate-90 text-white" />
				</div>
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

									{exercise.type === "quadrants" && (
										<QuadrantsHeaderNav exercise={exercise} />
									)}
								</li>
							))}
						</ul>
					</nav>
				</>
			)}
		</header>
	)
}

type StepNavItemProps = React.ComponentPropsWithoutRef<"button"> & {
	active: boolean
}

export const StepNavItem = ({ active = false, ...props }: StepNavItemProps) => (
	<button
		type="button"
		className={cx(
			"mx-6 uppercase transition-opacity text-24 font-heading hover:opacity-100 focus:opacity-100",
			active ? "opacity-100" : "opacity-50",
		)}
		{...props}
	/>
)
