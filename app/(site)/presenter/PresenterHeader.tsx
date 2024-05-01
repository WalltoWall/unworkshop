"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { Chevron } from "@/components/icons/Chevron"
import { Hamburger } from "@/components/icons/Hamburger"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import type * as ST from "@/sanity/types.gen"
import { QuadrantsHeaderNav } from "./[code]/[slug]/_QuadrantsExercise/QuadrantsHeaderNav"

interface PresenterHeaderProp {
	kickoffCode?: string
	exercises?: Array<ST.Exercise>
	exercise?: ST.Exercise
}

export const PresenterHeader = ({
	kickoffCode,
	exercises,
	exercise,
}: PresenterHeaderProp) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")

	const steps = exercise?.quadrants ? exercise.quadrants.length : null

	const [isOpen, setIsOpen] = useState(false)

	const changeStep = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams({
			step: e.target.value.toString(),
		})

		router.push(pathname + "?" + params.toString())
	}

	return (
		<header className="relative z-50 flex h-[5.5rem] items-center bg-black px-8 py-[1.125rem]">
			<Link href="/presenter">
				<Logo className="h-[3.25rem] w-[3.25rem] text-white" />
			</Link>

			{exercise?.name && (
				<Text
					size={48}
					className="ml-10 font-bold uppercase text-white font-heading"
				>
					{exercise.name}
				</Text>
			)}

			{steps && (
				<div className="relative mx-6">
					<select
						value={step}
						onChange={changeStep}
						className="h-9 min-w-28 appearance-none rounded-lg border border-gray-58 bg-black pb-2 pl-2 pr-7 pt-1 uppercase text-white text-18 font-heading"
					>
						{R.range(0, steps).map((_, index) => (
							<option key={index} value={index + 1}>
								Step {index + 1}
							</option>
						))}
					</select>

					<Chevron className="absolute right-2.5 top-1/2 h-[0.75rem] -translate-y-1/2 -rotate-90 text-white" />
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
						<ul className="flex flex-col gap-10">
							{exercises.map((e) => {
								return (
									<li key={e._id}>
										<Link
											className={cx(
												"relative inline-block pb-1 uppercase underline-offset-8 text-48 font-heading capsize hover:underline",
												exercise?._id === e._id && "underline",
											)}
											href={`/presenter/${kickoffCode}/${e.slug.current}`}
										>
											{e.name}
										</Link>

										{e.type === "quadrants" && (
											<QuadrantsHeaderNav exercise={e} />
										)}
									</li>
								)
							})}
						</ul>
					</nav>
				</>
			)}
		</header>
	)
}
