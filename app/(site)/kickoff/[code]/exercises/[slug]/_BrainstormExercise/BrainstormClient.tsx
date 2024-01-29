"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
import { CardScroller } from "./CardScroller"
import type { Answer, Color } from "./types"

interface BrainstormClientProps {
	steps:
		| ({
				prompt?: string | undefined
				helpText?: string | undefined
				color?: Color | undefined
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
	kickoffCode: string
}

const BrainstormClient = ({
	steps,
	groups,
	cards,
	exerciseId,
	kickoffCode,
}: BrainstormClientProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const step = parseInt(searchParams?.get("step") ?? "1")
	const totalSteps = steps?.length! - 1

	if (!steps) return

	return (
		<div className="flex h-full flex-col overflow-hidden">
			{steps && steps.at(step - 1) && (
				<div className="mt-1">
					<h4 className="max-w-[16rem] text-16 leading-[1.4] font-sans capsize">
						{steps.at(step - 1)?.prompt}
					</h4>
					<p className="mt-5 text-gray-50 text-12 leading-[1.5] font-sans capsize">
						{steps.at(step - 1)?.helpText}
					</p>
				</div>
			)}

			<CardScroller
				// Need key prop so that useOptimistic rerenders the cards correctly based off step see:https://github.com/facebook/react/issues/27617
				// see: https://github.com/vercel/next.js/issues/57662
				key={step}
				cards={cards.filter((card) => card.step === step)}
				exerciseId={exerciseId}
				group={groups.length > 0}
				color={steps.at(step - 1)?.color}
				step={step}
			/>

			<Steps
				steps={totalSteps!}
				activeStep={step}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
				disabled={false}
			/>
		</div>
	)
}

export default BrainstormClient
