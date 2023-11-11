"use client"

import React from "react"
import clsx from "clsx"
import { PlusIcon } from "@/components/icons/Plus"
import { XCircleIcon } from "@/components/icons/XCircle"
import { Steps } from "@/components/Steps"

export interface BrainstormExerciseProps {
	steps: Array<{
		helpText: string | undefined
		_key: string | undefined
		prompt: string | undefined
	}>
}

export const BrainstormExercise = ({ steps }: BrainstormExerciseProps) => {
	const [step, setStep] = React.useState<number>(1)
	const [cards, setCards] = React.useState<Array<string>>([])

	const handleDisabled = () => {
		return false
	}

	return (
		<div className="mt-4 flex h-full flex-col gap-9">
			{steps.at(step - 1) && (
				<div>
					<h4 className="max-w-[16rem] text-16 leading-[1.4] font-sans capsize">
						{steps.at(step - 1)?.prompt}
					</h4>
					<p className="mt-5 text-gray-50 text-12 leading-[1.5] font-sans capsize">
						{steps.at(step - 1)?.helpText}
					</p>
				</div>
			)}

			<div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 sm:grid-cols-[163px_163px]">
				<button className="flex flex-col items-center justify-center gap-3">
					<PlusIcon className="h-7 w-7 text-black" />
					<span className="text-14 max-w-[5rem] leading-none font-sans">
						Add another perception
					</span>
				</button>

				<div className="relative min-h-[187px] overflow-y-scroll rounded-lg bg-green-78 p-3.5">
					<input
						type="text"
						className="placeholder:text-18 card-input h-full w-full bg-transparent placeholder:whitespace-pre-line placeholder:text-black placeholder:leading-[1.25]"
						placeholder="Type something here to add your perception"
					/>

					<button className="absolute bottom-2 right-1.5">
						<XCircleIcon className="h-6 w-6" />
					</button>
				</div>
			</div>

			<Steps
				disabled={handleDisabled()}
				count={steps.length}
				active={step}
				onActiveChange={setStep}
				onFinish={() => alert("done")}
				className="mt-auto"
			/>
		</div>
	)
}
