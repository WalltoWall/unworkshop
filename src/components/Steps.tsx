"use client"

import { ArrowBigLeftIcon, ArrowBigRightIcon, CheckIcon } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"
import { cx } from "class-variance-authority"
import * as R from "remeda"
import { useKickoffParams } from "@/lib/use-kickoff-params"
import { useStep } from "@/lib/use-step"
import { text } from "@/styles/text"

const MAX_PAGINATION_DOTS = 3

interface Props {
	steps: number
	className?: string
}

export const Steps = ({ steps, className }: Props) => {
	const [step, setStep] = useStep()
	const router = useRouter()
	const params = useKickoffParams()
	if (step > steps) throw new Error("Viewing a step that shouldn't exist.")

	const onLastStep = step === steps

	const nextStep = () => setStep(step + 1)
	const prevStep = () => setStep(step - 1)
	const finalize = () => router.push(`/kickoff/${params.code}`)

	return (
		<div className={cx(className, "flex items-center justify-between")}>
			<button
				className={cx(
					step <= 1 && "invisible",
					"flex w-20 items-center gap-1.5 transition hover:text-neutral-700",
				)}
				onClick={prevStep}
			>
				<ArrowBigLeftIcon className="mt-0.75 size-5 shrink-0 fill-current" />
				<span className={text({ style: "heading", size: 20 })}>Back</span>
			</button>

			<div className="relative">
				<div className="absolute inset-y-0 right-full mr-2 flex items-center gap-2">
					{R.pipe(
						R.range(0, step - 1),
						R.takeLast(MAX_PAGINATION_DOTS),
						R.map((i) => (
							<button
								key={i}
								className="size-3 rounded-full bg-neutral-300 transition hover:bg-black"
								onClick={() => setStep(i + 1)}
							>
								<div className="sr-only">Go to step {i + 1}</div>
							</button>
						)),
					)}
				</div>

				<button
					className="flex size-8 items-center justify-center rounded-full bg-black px-2 text-white transition hover:bg-neutral-700"
					onClick={finalize}
					disabled={!onLastStep}
				>
					{step === steps ? (
						<CheckIcon className="size-3.5" strokeWidth={3} />
					) : (
						<span className={text({ size: 16, class: "mb-0.5 font-bold" })}>
							{step}
						</span>
					)}
				</button>

				<div className="absolute inset-y-0 left-full ml-2 flex items-center gap-2">
					{R.pipe(
						R.range(step, steps),
						R.take(MAX_PAGINATION_DOTS),
						R.map((i) => (
							<button
								key={i}
								className="size-3 rounded-full bg-neutral-300 transition hover:bg-black"
								onClick={() => setStep(i + 1)}
							>
								<div className="sr-only">Go to step {i + 1}</div>
							</button>
						)),
					)}
				</div>
			</div>

			<button
				className="flex w-20 items-center justify-end gap-1.5 transition hover:text-neutral-700"
				onClick={onLastStep ? finalize : nextStep}
			>
				<span className={text({ style: "heading", size: 20 })}>
					{onLastStep ? "Finish" : "Next"}
				</span>
				<ArrowBigRightIcon className="mt-0.75 size-5 shrink-0 fill-current" />
			</button>
		</div>
	)
}
