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
	const [isScrollable, setIsScrollable] = React.useState(false)
	const [cards, setCards] = React.useState<Array<string>>([""])
	const cardContainerRef = React.useRef<HTMLDivElement>(null)

	const handleDisabled = () => {
		return false
	}

	return (
		<div className="mt-4 flex h-full flex-col">
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

			<div
				className={clsx(
					"scroll-shadow scroll-shadow-4 relative mx-auto my-8 grid max-h-full grow grid-cols-2 content-start gap-2.5 overflow-y-scroll py-4 scrollbar-hide sm:grid-cols-[163px_163px]",
				)}
				ref={cardContainerRef}
			>
				<button
					className="flex flex-col items-center justify-center gap-3"
					onClick={() => setCards([...cards, ""])}
				>
					<PlusIcon className="h-7 w-7 text-black" />
					<span className="max-w-[5rem] text-14 leading-none font-sans">
						Add another perception
					</span>
				</button>

				{cards.reverse().map((card, idx) => (
					<div
						className="animate-fadeIn relative h-[187px] rounded-lg bg-green-78 p-3.5 scrollbar-hide"
						key={idx}
					>
						<textarea
							className="card-input h-full w-full resize-none bg-transparent pt-3.5 placeholder:text-black placeholder:text-18 placeholder:leading-[1.25] focus:outline-none"
							placeholder="Type something here to add your perception"
						/>

						<button
							className="absolute bottom-2 right-1.5"
							onClick={() => setCards(cards.filter((_, i) => i !== idx))}
						>
							<XCircleIcon className="h-6 w-6" />
						</button>
					</div>
				))}
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
