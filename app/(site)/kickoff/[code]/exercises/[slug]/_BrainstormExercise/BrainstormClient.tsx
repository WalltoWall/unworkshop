"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Checkmark } from "@/components/icons/Checkmark"
import { Chevron } from "@/components/icons/Chevron"
import { CardScroller } from "./CardScroller"
import type { Answer } from "./types"

interface BrainstormClientProps {
	steps:
		| ({
				prompt?: string | undefined
				helpText?: string | undefined
		  } & {
				_key: string
		  })[]
		| undefined
	groups: ({
		name: string
	} & {
		_key: string
	})[]
	cards: Array<Answer>
	exerciseId: string
}

const BrainstormClient = ({
	steps,
	groups,
	cards,
	exerciseId,
}: BrainstormClientProps) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	let step = parseInt(searchParams?.get("step") ?? "1")
	const isFinished = steps?.length! <= step

	const nextStep = () => {
		const params = new URLSearchParams({
			step: step.toString(),
		})

		if (!pathname) return null

		router.push(pathname + "?" + params.toString(), { scroll: false })
	}

	return (
		<div className="h-full">
			{steps && steps.at(step - 1) && (
				<div>
					<h4 className="max-w-[16rem] text-16 leading-[1.4] font-sans capsize">
						{steps.at(step - 1)?.prompt}
					</h4>
					<p className="mt-5 text-gray-50 text-12 leading-[1.5] font-sans capsize">
						{steps.at(step - 1)?.helpText}
					</p>
				</div>
			)}

			<CardScroller
				cards={cards}
				exerciseId={exerciseId}
				group={groups.length > 0}
				color={steps?.at(step - 1).color}
			/>

			<button
				className="mx-auto mt-auto flex flex-col items-center gap-4"
				onClick={() => {
					if (step >= steps?.length!) {
						step = 1
						return
					}
					step = step + 1
					nextStep()
				}}
			>
				<div className="flex h-8 w-8 flex-col items-center justify-center rounded-full bg-black px-2 text-white">
					{isFinished ? <Checkmark /> : <Chevron className="ml-1 rotate-180" />}
				</div>
				<span className="font-extrabold uppercase text-14 leading-[1.5] font-sans capsize">
					{isFinished ? "Finish" : "Next Step"}
				</span>
			</button>
		</div>
	)
}

export default BrainstormClient
