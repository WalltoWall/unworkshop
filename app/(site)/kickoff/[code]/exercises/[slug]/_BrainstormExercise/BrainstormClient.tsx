"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Steps } from "@/components/Steps"
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

	const [activeStep, setActiveStep] = React.useState(step)

	return (
		<div className="flex h-full flex-col">
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
				cards={cards.filter((card) => card.step === step) ?? []}
				exerciseId={exerciseId}
				group={groups.length > 0}
				color={steps.at(step - 1).color}
				step={step}
			/>

			<Steps
				steps={totalSteps!}
				activeStep={activeStep}
				onFinish={() => router.push(`/kickoff/${kickoffCode}/exercises`)}
				onNextStep={setActiveStep}
				disabled={false}
			/>
		</div>
	)
}

export default BrainstormClient
